// GameCore.js
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import $ from "jquery";
import { setupPlayerControls } from "../controler/control.js"; // Tu ruta correcta

let scene, camera, renderer, player, controls, playerMovement;
let css2dRenderer;
const clock = new THREE.Clock();

export function initGameCore(container, initialSceneLoader) {
  // 1. Setup Base THREE.js
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  window.scene = scene; 

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.8, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $(container).append(renderer.domElement);
  
    // ----- [NUEVO] RENDERIZADOR CSS2D (HTML) -----
  css2dRenderer = new CSS2DRenderer();
  css2dRenderer.setSize(window.innerWidth, window.innerHeight);
  // Estilo para que se superponga
  css2dRenderer.domElement.style.position = 'absolute';
  css2dRenderer.domElement.style.top = '0px';
  css2dRenderer.domElement.style.pointerEvents = 'none'; // ¡Importante! Para que no bloquee los clics
  $(container).append(css2dRenderer.domElement);

  // 2. Jugador (Player Mesh)
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  player.position.set(0, 1, 0);
  scene.add(player);
  window.player = player; 

  // 3. Controles FPS
  controls = new PointerLockControls(camera, renderer.domElement);
  $(document.body).on('click', () => controls.lock()); 
  playerMovement = setupPlayerControls(camera, controls, player);

  // 4. Luces base
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const ambient = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambient);
  
  // 5. Cargar escena inicial
  loadScene(initialSceneLoader);

  // 6. Bucle de animación
  animate();

  // 7. Handlers de ventana
  $(window).on("resize", handleResize);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  
  // Asumimos que esto actualiza player.position Y player.rotation
  playerMovement.updateMovement(delta); 
  
  // Lógica de red
  if (window.sendPlayerPosition) {
    // [MODIFICACIÓN CLAVE]
    // Enviamos un objeto plano con los datos, no el mesh completo.
    window.sendPlayerPosition({
        position: player.position,
        rotation: player.rotation
    });
  }

  // Lógica de coordenadas
  const camPosition = camera.position;
  const coordsElement = document.getElementById('coordinates');
  if (coordsElement) {
    coordsElement.textContent = `X: ${camPosition.x.toFixed(2)} | Y: ${camPosition.y.toFixed(2)} | Z: ${camPosition.z.toFixed(2)}`;
  }

  renderer.render(scene, camera);
  if (css2dRenderer) {
    css2dRenderer.render(scene, camera);
  }
}

function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (css2dRenderer) {
      css2dRenderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export function loadScene(sceneLoader) {
    const persistentObjects = [camera, player, scene.children.find(c => c.isDirectionalLight), scene.children.find(c => c.isAmbientLight)];

    scene.children.slice().forEach(child => {
        if (!persistentObjects.includes(child)) {
            scene.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        }
    });

    sceneLoader(scene);
    console.log("Nuevo escenario cargado.");
}