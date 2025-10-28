// client.js
import { io } from "socket.io-client";
import * as THREE from "three";

let socket;
const otherPlayers = {};

// [MODIFICACIÓN CLAVE] Función de inicialización que se llama desde main.js
export function initSocketClient() {
  socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Conectado al servidor con id:", socket.id);
  });

  // Función global para enviar posición, llamada desde scene.js
  window.sendPlayerPosition = function(pos) {
    socket.emit("playerMove", {
      x: pos.x,
      y: pos.y,
      z: pos.z,
    });
  };

  // Recibir jugadores remotos
  socket.on("updatePlayer", (data) => {
    const { id, position } = data;

    // Ignorar nuestro propio jugador
    if (id === socket.id) return;

    if (!otherPlayers[id]) {
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
      const mesh = new THREE.Mesh(geometry, material);

      // window.scene ahora está garantizada de existir
      window.scene.add(mesh);
      otherPlayers[id] = mesh;
    }

    otherPlayers[id].position.set(position.x, position.y, position.z);
  });

  // Eliminar jugador que se desconecta
  socket.on("removePlayer", (id) => {
    if (otherPlayers[id]) {
      window.scene.remove(otherPlayers[id]);
      delete otherPlayers[id];
    }
  });

  // Crear jugadores existentes al conectarse
  socket.on("existingPlayers", (allPlayers) => {
    Object.entries(allPlayers).forEach(([id, pos]) => {
      if (id === socket.id) return;
      if (!otherPlayers[id]) { 
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(pos.x, pos.y, pos.z);
        // window.scene ahora está garantizada de existir
        window.scene.add(mesh); 
        otherPlayers[id] = mesh;
      }
    });
  });
}