// modelLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Carga un modelo GLTF/GLB y lo añade a la escena.
 * @param {string} path La ruta del archivo del modelo (ej: './assets/modelo.glb').
 * @param {THREE.Scene} scene La escena de Three.js donde se añadirá el modelo.
 * @param {function(THREE.Object3D): void} [onLoadCallback] Función opcional a ejecutar al finalizar la carga.
 */
export function loadGLTFModel(path, scene, onLoadCallback) {
    const loader = new GLTFLoader();

    console.log(`Cargando modelo GLTF/GLB desde: ${path}`);

    loader.load(
        // Ruta del recurso
        path,
        
        // Función a llamar cuando el recurso se ha cargado
        function (gltf) {
            const model = gltf.scene;
            scene.add(model);
            console.log(`Modelo GLB cargado exitosamente: ${path}`);

            if (onLoadCallback) {
                onLoadCallback(model);
            }
        },
        
        // Función a llamar mientras progresa la carga
        function (xhr) {
            // Puedes añadir tu lógica de barra de progreso aquí
            // console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% cargado`);
        },
        
        // Función a llamar si ocurre un error
        function (error) {
            console.error(`Error al cargar el modelo GLB: ${path}`, error);
        }
    );
}