// scene.js (Modificado)
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import $ from "jquery";
import { setupPlayerControls } from "../controler/control.js"; 

export default function initScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.8, 5); // Posición inicial de la cámara

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $(container).append(renderer.domElement);

  const gridHelper = new THREE.GridHelper(200, 50, 0x444444, 0x888888);
  scene.add(gridHelper);
  
  const axesHelper = new THREE.AxesHelper(10); 
  scene.add(axesHelper);

  // Luces
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  const ambient = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambient);

  // Terreno verde
  const terrain = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  terrain.rotateX(-Math.PI / 2);
  scene.add(terrain);

  // Cubo jugador (propio, color rojo)
  const player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  player.position.set(0, 1, 0); // Posición inicial del mesh (cubo)
  scene.add(player);

  // Controles FPS
  const controls = new PointerLockControls(camera, renderer.domElement);
  $(document.body).on('click', () => controls.lock());

  // Inicializa la lógica de movimiento separada
  const playerMovement = setupPlayerControls(camera, controls, player);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    
    // Llama a la lógica de movimiento y aplica la gravedad/salto
    playerMovement.updateMovement(delta);
    
    // Enviar posición en el bucle de animación
    if (window.sendPlayerPosition) {
        window.sendPlayerPosition(player.position);
    }

    const camPosition = camera.position;
    const coordsElement = document.getElementById('coordinates');

    if (coordsElement) {
        coordsElement.textContent = `X: ${camPosition.x.toFixed(2)} | Y: ${camPosition.y.toFixed(2)} | Z: ${camPosition.z.toFixed(2)}`;
    }

    renderer.render(scene, camera);
  }
  animate();

  $(window).on("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Exponer globales para client.js
  window.player = player;
  window.scene = scene;

  return { camera, player, scene };
}