// main.js
import initScene from "./modules/scene.js";
import { initSocketClient } from "./client.js"; // Importar la función de inicialización del cliente

const container = document.body;

// 1. Inicializar la escena y definir las variables globales (window.scene, window.player)
initScene(container);

// 2. SOLO DESPUÉS, inicializar el cliente de Socket.IO
initSocketClient();