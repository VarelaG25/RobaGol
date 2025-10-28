// controls.js (CORREGIDO)
import * as THREE from "three";
import $ from "jquery";

export function setupPlayerControls(camera, controls, player) {
  const move = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  };
  const velocity = new THREE.Vector3();
  const GRAVITY = 9.8;
  const JUMP_IMPULSE = 4;
  let canJump = false;

  // Permite saltar al hacer clic e iniciar los controles
  controls.addEventListener("lock", function () {
    canJump = true;
  });

  // Listeners de teclado
  $(document).on("keydown", (e) => {
    if (e.code === "KeyW") move.forward = true;
    if (e.code === "KeyS") move.backward = true;
    if (e.code === "KeyA") move.left = true;
    if (e.code === "KeyD") move.right = true;
    if (e.code === "Space") move.jump = true;
  });

  $(document).on("keyup", (e) => {
    if (e.code === "KeyW") move.forward = false;
    if (e.code === "KeyS") move.backward = false;
    if (e.code === "KeyA") move.left = false;
    if (e.code === "KeyD") move.right = false;
    if (e.code === "Space") move.jump = false;
  });

  function updateMovement(delta) {
    const speed = 5;
    // const camObject = controls.getObject(); <--- ERROR ELIMINADO

    // 1. Movimiento Horizontal (X y Z)
    // Aplicar fricción para detener el movimiento gradualmente
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    // Aplicar aceleración horizontal
    if (move.forward) velocity.z -= speed * delta;
    if (move.backward) velocity.z += speed * delta;
    if (move.left) velocity.x -= speed * delta;
    if (move.right) velocity.x += speed * delta;

    // Aplicar movimiento
    controls.moveRight(velocity.x);
    controls.moveForward(-velocity.z);

    // 2. Gravedad y Salto (Y)

    // A. Aplicar Gravedad: Solo cuando no podemos saltar (estamos en el aire)
    if (canJump === false) {
      velocity.y -= GRAVITY * delta;
    }

    // B. Impulso de Salto: Si podemos saltar y la tecla está presionada
    if (canJump && move.jump) {
      velocity.y = JUMP_IMPULSE;
      canJump = false;
    }

    // C. Aplicar Posición Y a la cámara (la instancia que se le pasó a la función)
    // [MODIFICACIÓN CLAVE] Usamos directamente 'camera.position'
    camera.position.y += velocity.y * delta;

    // 3. Chequeo de Suelo
    const groundLevel = 1.8; // Altura de la cámara sobre el suelo

    if (camera.position.y < groundLevel) {
      // Al tocar el suelo
      velocity.y = 0;
      camera.position.y = groundLevel;
      canJump = true;
    }

    // 4. Sincronización del Mesh del Jugador (Cubo Rojo)
    // Usamos camera.position, que es la misma que movimos en el punto 2.C
    player.position.set(
      camera.position.x,
      camera.position.y - 0.8, // <-- ¡CORREGIDO!
      camera.position.z
    );
    player.rotation.y = camera.rotation.y;
  }

  return { updateMovement };
}
