// main.js (Modificado)
import { initGameCore, loadScene } from "./modules/gameCore.js"; // Importa las funciones del núcleo del juego
import { initSocketClient } from "./client.js"; // Importa la función de inicialización de red
import { setupLobbyScene } from "./modules/levels/1.Stadium/scene/level_1.js";

const container = document.body;

// 1. Inicializar el núcleo del juego y cargar la escena inicial
initGameCore(container, setupLobbyScene); 

// 2. Inicializar el cliente Socket.IO
initSocketClient(); 

// [OPCIONAL] Función de prueba para cambiar de escena (puedes llamarla desde la consola)
window.changeToLobby = () => loadScene(setupLobbyScene);
// window.changeToArena = () => loadScene(setupArenaScene);