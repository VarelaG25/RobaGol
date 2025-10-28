// Scene_Lobby.js
import * as THREE from "three";
import { loadGLTFModel } from "../../../../models/modelLoader.js";

/**
 * Define el contenido del Escenario del Lobby.
 * @param {THREE.Scene} scene La escena activa para añadir objetos.
 */
export function setupLobbyScene(scene) {
    // 1. Terreno verde
    const terrain = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshStandardMaterial({ color: 0x228b22 })
    );
    terrain.rotateX(-Math.PI / 2);
    terrain.name = "Lobby_Terrain";
    scene.add(terrain);

    // 2. Cuadrícula de Ayuda
    const gridHelper = new THREE.GridHelper(200, 20, 0x444444, 0x888888);
    gridHelper.name = "Lobby_Grid";
    scene.add(gridHelper);

    // 3. Sistema de Coordenadas
    const axesHelper = new THREE.AxesHelper(10); 
    axesHelper.name = "Lobby_Axes";
    scene.add(axesHelper); 
    
    loadGLTFModel("/models/stage_1/Balon.glb", scene, (balonModel) => {
        
        // 1. Posicionar el balón en el centro (justo encima del suelo)
        // La Y=0.25 asume que el balón tiene un radio de 0.25, centrándolo.
        balonModel.position.set(0, 0.25, 0); 
        
        // 2. Ajustar la escala si es necesario
        balonModel.scale.set(2, 2, 2); 

        // 3. Opcional: Rotar para que la parte correcta mire hacia el frente (solo si es necesario)
        // balonModel.rotation.y = Math.PI / 2; 

        balonModel.name = "Lobby_Balon";
        console.log("Balón cargado y colocado.");
        
        // El modelo ya se añadió a la escena dentro de loadGLTFModel, pero puedes 
        // hacer más ajustes al objeto aquí si necesitas interactuar con él más tarde.
    });

    loadGLTFModel("/models/stage_1/Banca.glb", scene, (bancaModel) => {
        bancaModel.position.set(2, 0.25, 2); 
        bancaModel.scale.set(2, 2, 2); 
        bancaModel.name = "Lobby_Banca";
        console.log("Banca cargada y colocada.");
    });

    loadGLTFModel("/models/stage_1/Cancha.glb", scene, (canchaModel) => {
        canchaModel.position.set(-45, 0, 15); 
        canchaModel.scale.set(1, 1, 1); 
        canchaModel.name = "Lobby_Cancha";
        console.log("Cancha cargada y colocada.");
    });

    loadGLTFModel("/models/stage_1/Gradas.glb", scene, (gradasModel) => {
        gradasModel.position.set(-25, 0, 50); 
        gradasModel.scale.set(1, 1, 1); 
        gradasModel.name = "Lobby_Gradas";
        console.log("Gradas cargadas y colocadas.");
    });

    loadGLTFModel("/models/stage_1/LucesEstadio.glb", scene, (lucesModel) => {
        lucesModel.position.set(-39, 3, -25);
        lucesModel.scale.set(1, 1, 1); 
        lucesModel.name = "Lobby_Luces";
        console.log("Luces cargadas y colocadas.");
    });

    loadGLTFModel("/models/stage_1/Muro.glb", scene, (muroModel) => {
        muroModel.position.set(-15, 0, -25);
        muroModel.scale.set(1, 1, 1); 
        muroModel.name = "Lobby_Muro";
        console.log("Muro cargado y colocado.");
    });
}