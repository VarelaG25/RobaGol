import * as THREE from "three";
import $ from "jquery";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export default function initScene(container) {
  // 1️⃣ Escena
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  // 2️⃣ Cámara
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.8, 5); // altura player
  camera.lookAt(0, 0, 0);

  // 3️⃣ Render
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  $(container).append(renderer.domElement);

  // 4️⃣ Luces
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040, 1.5);
  scene.add(ambient);

  // 5️⃣ Helpers
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);

  // 6️⃣ Terreno plano
  const terrainGeo = new THREE.PlaneGeometry(200, 200);
  terrainGeo.rotateX(-Math.PI / 2);

  const terrainMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrain);

  // 7️⃣ Cubo de referencia
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const cubeMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(0, 0.5, 0); // medio sobre el suelo
  scene.add(cube);

  // 8️⃣ Controles FPS
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

  // 9️⃣ Coordenadas en pantalla
  const $coordDiv = $('<div id="coords"></div>').css({
    position: "absolute",
    top: "10px",
    left: "10px",
    color: "white",
    fontFamily: "monospace",
  });
  $(container).append($coordDiv);

  function showCoordinates(x, y, z) {
    $coordDiv.text(
      `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, Z: ${z.toFixed(2)}`
    );
  }

  const clock = new THREE.Clock();

  // 10️⃣ Animación
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

    // obtener posición directamente de la cámara
    const pos = camera.position;
    showCoordinates(pos.x, pos.y, pos.z);

    renderer.render(scene, camera);
  }

  animate();

  // 11️⃣ Redimensionar
  $(window).on("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
