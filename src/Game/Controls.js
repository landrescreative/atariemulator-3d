import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export default class Controls {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    this.movementSpeed = 0.05;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.addEventListeners();

    this.pov = new PointerLockControls(this.camera, document.body);
  }

  addEventListeners() {
    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    document.addEventListener("keyup", (event) => this.onKeyUp(event));

    // Para capturar el puntero
    document.body.requestPointerLock =
      document.body.requestPointerLock ||
      document.body.mozRequestPointerLock ||
      document.body.webkitRequestPointerLock;
    document.addEventListener("click", () => {
      document.body.requestPointerLock();
    });
  }

  onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // W
        this.moveForward = true;
        break;
      case 83: // S
        this.moveBackward = true;
        break;
      case 65: // A
        this.moveLeft = true;
        break;
      case 68: // D
        this.moveRight = true;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case 87: // W
        this.moveForward = false;
        break;
      case 83: // S
        this.moveBackward = false;
        break;
      case 65: // A
        this.moveLeft = false;
        break;
      case 68: // D
        this.moveRight = false;
        break;
    }
  }

  timing() {
    this.elapsedTime = Date.now();
    this.deltaTime = this.elapsedTime - this.oldTime;
    this.oldTime = this.elapsedTime;
  }

  update() {
    if (this.moveForward) this.camera.translateZ(-this.movementSpeed);
    if (this.moveBackward) this.camera.translateZ(this.movementSpeed);
    if (this.moveLeft) this.camera.translateX(-this.movementSpeed);
    if (this.moveRight) this.camera.translateX(this.movementSpeed);
  }
}
