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

    // Cargar otros modelos 3D necesarios para el escenario
    // Copiar y pegar
    loadGLTFModel("/models/stage_1/Muro.glb", scene, (muroModel) => {
        muroModel.position.set(-15, 0, -25);
        muroModel.scale.set(1, 1, 1); 
        muroModel.name = "Lobby_Muro";
        console.log("Muro cargado y colocado.");
    });
}