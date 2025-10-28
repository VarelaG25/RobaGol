// client.js (CORREGIDO)
import { io } from "socket.io-client";
import * as THREE from "three";
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

let socket;
const otherPlayers = {};
/**
 * [NUEVO] Crea una etiqueta HTML para un jugador.
 * @param {string} text - El texto a mostrar (ej. el ID del socket).
 * @returns {CSS2DObject} - El objeto 2D para añadir a la escena.
 */
function createPlayerTag(text) {
    const div = document.createElement('div');
    div.className = 'player-tag';
    div.textContent = text;
    
    // Estilos (puedes mover esto a tu CSS)
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    div.style.color = 'white';
    div.style.padding = '2px 8px';
    div.style.borderRadius = '4px';
    div.style.fontSize = '12px';
    div.style.fontFamily = 'Arial, sans-serif';

    const label = new CSS2DObject(div);
    // Posiciona la etiqueta ligeramente encima del cubo
    // Si el cubo mide 2 de alto (centro en 1), 2.0 está bien.
    label.position.set(0, 2.0, 0); 
    
    return label;
}
// [CORREGIDO] Acepta 'data' (que es {x, y, z, ry})
function createOtherPlayerMesh(id, data) {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const mesh = new THREE.Mesh(geometry, material);

  // Aplica posición y rotación iniciales
  mesh.position.set(data.x, data.y, data.z);
  mesh.rotation.y = data.ry || 0; // || 0 para evitar errores si ry es undefined
  
  // [NUEVO] Crear y añadir la etiqueta de jugador
  // Usamos los primeros 5 caracteres del ID como nombre
  const tag = createPlayerTag(id.substring(0, 5));
  mesh.add(tag);

  window.scene.add(mesh);
  otherPlayers[id] = mesh;
}

// Función de inicialización exportada que se llama desde main.js
export function initSocketClient() {
  socket = io("http://localhost:3000");

  socket.on("connect", () => {
    console.log("Conectado al servidor con id:", socket.id);
  });

  // [CORREGIDO] Acepta el objeto {position, rotation} de GameCore
  window.sendPlayerPosition = function(playerData) {
    socket.emit("playerMove", {
      x: playerData.position.x,
      y: playerData.position.y,
      z: playerData.position.z,
      ry: playerData.rotation.y // <-- ¡ARREGLADO! Se envía la rotación
    });
  };

  // [CORREGIDO] Recibe el objeto plano del servidor
  socket.on("updatePlayer", (data) => {
    // Destructuramos el objeto plano que envía el servidor
    const { id, x, y, z, ry } = data; 

    // Ignorar nuestro propio jugador
    if (id === socket.id) return;

    if (!otherPlayers[id]) {
      // Pasamos el objeto 'data' completo, no 'data.position'
      createOtherPlayerMesh(id, data); 
    }

    // Actualizamos posición Y rotación
    otherPlayers[id].position.set(x, y, z);
    otherPlayers[id].rotation.y = ry || 0;
  });


  // Eliminar jugador que se desconecta
  socket.on("removePlayer", (id) => {
    if (otherPlayers[id]) {
      window.scene.remove(otherPlayers[id]);
      delete otherPlayers[id];
    }
  });

  // [CORREGIDO] Recibe el objeto plano del servidor
  socket.on("existingPlayers", (allPlayers) => {
    Object.entries(allPlayers).forEach(([id, data]) => { // 'data' es {x, y, z, ry}
      if (id === socket.id) return;
      
      if (!otherPlayers[id]) { 
        createOtherPlayerMesh(id, data);
      }
    });
  });
}