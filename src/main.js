// main.js (Modificado)
import initScene from "./modules/scene.js";
import { initSocketClient } from "./client.js"; // Importa la función de inicialización de red

const container = document.body;

// 1. Inicializar la escena (crea window.scene y window.player)
initScene(container);

// 2. Inicializar el cliente Socket.IO (ahora window.scene existe)
initSocketClient();