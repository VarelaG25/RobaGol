// scene.js
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import $ from "jquery";

export default function initScene(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.8, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $(container).append(renderer.domElement);

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

  // Cubo jugador (Este es tu propio cubo, el que mueves)
  const player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  player.position.set(0, 1, 0);
  scene.add(player);

  // Controles FPS
  const controls = new PointerLockControls(camera, renderer.domElement);
  $(document.body).click(() => controls.lock());

  const move = { forward: false, backward: false, left: false, right: false };
  const velocity = new THREE.Vector3();

  $(document).on("keydown", (e) => {
    if (e.code === "KeyW") move.forward = true;
    if (e.code === "KeyS") move.backward = true;
    if (e.code === "KeyA") move.left = true;
    if (e.code === "KeyD") move.right = true;
  });

  $(document).on("keyup", (e) => {
    if (e.code === "KeyW") move.forward = false;
    if (e.code === "KeyS") move.backward = false;
    if (e.code === "KeyA") move.left = false;
    if (e.code === "KeyD") move.right = false;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const speed = 5;

    velocity.set(0, 0, 0);
    if (move.forward) velocity.z -= speed * delta;
    if (move.backward) velocity.z += speed * delta;
    if (move.left) velocity.x -= speed * delta;
    if (move.right) velocity.x += speed * delta;

    controls.moveRight(velocity.x);
    controls.moveForward(-velocity.z);

    // Mantener mesh del jugador en la posición de la cámara
    const camPos = camera.position;
    player.position.set(camPos.x, 1, camPos.z);
    
    // [MODIFICACIÓN CLAVE] Enviar posición en el bucle de animación
    if (window.sendPlayerPosition) {
        window.sendPlayerPosition(player.position);
    }

    renderer.render(scene, camera);
  }
  animate();

  $(window).on("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Exponer globales
  window.player = player;
  window.scene = scene;

  return { camera, player, scene };
}