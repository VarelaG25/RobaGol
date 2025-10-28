// main.js (Modificado)
import { initGameCore, loadScene } from "./modules/gameCore.js"; // Importa las funciones del núcleo del juego
import { initSocketClient } from "./client.js"; // Importa la función de inicialización de red
import { setupLobbyScene } from "./modules/levels/1.Stadium/scene/level_1.js";

const container = document.body;

async function initializeGame() {
    // 1. ESPERAMOS que el núcleo del juego cargue (incluyendo el modelo GLB)
    await initGameCore(container, setupLobbyScene); 
    
    // 2. SOLO ENTONCES inicializamos el cliente Socket.IO
    initSocketClient();
}

initializeGame();

// [OPCIONAL] Función de prueba para cambiar de escena (puedes llamarla desde la consola)
window.changeToLobby = () => loadScene(setupLobbyScene);
// window.changeToArena = () => loadScene(setupArenaScene);