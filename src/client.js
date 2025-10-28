// client.js (VERSIÓN FINAL CON CORRECCIÓN DE ROTACIÓN)
import { io } from "socket.io-client";
import * as THREE from "three";
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'; // Necesario para etiquetas

let socket;
const otherPlayers = {};

// Función auxiliar para etiquetas (asumiendo que la quieres mantener)
function createPlayerTag(text) {
    const div = document.createElement('div');
    div.className = 'player-tag';
    div.textContent = text;
    // ... (estilos omitidos por brevedad) ...
    const label = new CSS2DObject(div);
    label.position.set(0, 1.3, 0); 
    return label;
}

// Función auxiliar para crear y agregar el cubo del jugador remoto (AZUL)
function createOtherPlayerMesh(id, data) {
  
  let mesh;

  // 1. Comprobar si la plantilla del modelo está lista (si no, usamos cubo de respaldo)
  if (window.playerModelTemplate) {
      mesh = window.playerModelTemplate.clone();
  } else {
      console.warn("Modelo no cargado. Usando cubo de respaldo para jugador remoto.");
      const geometry = new THREE.BoxGeometry(1, 2, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
      // 🥳 ¡IMPORTANTE! Asegúrate de asignar el valor A LA VARIABLE mesh
      mesh = new THREE.Mesh(geometry, material); 
  }

  // Aplica posición y rotación iniciales
  mesh.position.set(data.x, data.y, data.z);
  mesh.rotation.y = data.ry || 0; 
  
  // Creamos la etiqueta
  const tag = createPlayerTag(id.substring(0, 5));
  
  // 🥳 Aquí usamos mesh.add(tag), y mesh ya no es 'undefined'
  mesh.add(tag); 
  
  window.scene.add(mesh);
  otherPlayers[id] = mesh;
}

export function initSocketClient() {
  socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Conectado al servidor con id:", socket.id);
  });

  // 1. Envío de Datos: Asegúrate de que ry se envíe
  // Esta función es llamada desde gameCore.js
  window.sendPlayerPosition = function(playerData) {
    socket.emit("playerMove", {
      x: playerData.position.x,
      y: playerData.position.y,
      z: playerData.position.z,
      ry: playerData.rotation.y // 🥳 ¡CLAVE! Se envía la rotación Y
    });
  };

  // 2. Recepción de Datos: Asegúrate de que ry se reciba y aplique
  socket.on("updatePlayer", (data) => {
    // 🥳 ¡CLAVE! Desestructuramos el objeto plano con ry
    const { id, x, y, z, ry } = data; 

    if (id === socket.id) return;

    if (!otherPlayers[id]) {
      createOtherPlayerMesh(id, data); 
    }

    // Actualizamos posición Y rotación
    otherPlayers[id].position.set(x, y, z);
    otherPlayers[id].rotation.y = ry || 0; // 🥳 ¡CLAVE! Se aplica la rotación
  });


  // Eliminar jugador que se desconecta
  socket.on("removePlayer", (id) => {
    if (otherPlayers[id]) {
      window.scene.remove(otherPlayers[id]);
      delete otherPlayers[id];
    }
  });

  // Jugadores existentes: Asegúrate de que ry se aplique
  socket.on("existingPlayers", (allPlayers) => {
    Object.entries(allPlayers).forEach(([id, data]) => { 
      if (id === socket.id) return;
      
      if (!otherPlayers[id]) { 
        createOtherPlayerMesh(id, data);
      }
    });
  });
}