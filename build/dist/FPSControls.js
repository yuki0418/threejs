import * as THREE from "../_snowpack/pkg/three.js";
import {PointerLockControls} from "../_snowpack/pkg/three/examples/jsm/controls/PointerLockControls.js";
export class FPSControls extends PointerLockControls {
  constructor(camera, domElement) {
    super(camera, domElement);
    this._euler = new THREE.Euler(0, 0, 0, "YXZ");
    this._PI_2 = Math.PI / 2;
    this.handleKeyDown = (e) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          this.isMoveForward = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          this.isMoveLeft = true;
          break;
        case "ArrowDown":
        case "KeyS":
          this.isMoveBackward = true;
          break;
        case "ArrowRight":
        case "KeyD":
          this.isMoveRight = true;
          break;
      }
    };
    this.handleKeyUp = (e) => {
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          this.isMoveForward = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          this.isMoveLeft = false;
          break;
        case "ArrowDown":
        case "KeyS":
          this.isMoveBackward = false;
          break;
        case "ArrowRight":
        case "KeyD":
          this.isMoveRight = false;
          break;
      }
    };
    this.HandleMouseMove = (e) => {
      if (this.isLocked === false)
        return;
      const movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
      const movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
      this._euler.setFromQuaternion(this.camera.quaternion);
      this._euler.y -= movementX * 2e-3;
      this._euler.x -= movementY * 2e-3;
      this._euler.x = Math.max(this._PI_2 - this.maxPolarAngle, Math.min(this._PI_2 - this.minPolarAngle, this._euler.x));
      this.camera.quaternion.setFromEuler(this._euler);
    };
    this.checkMove = () => {
      if (this.isMoveForward)
        this.moveForward(this.speed);
      if (this.isMoveBackward)
        this.moveForward(-this.speed);
      if (this.isMoveRight)
        this.moveRight(this.speed);
      if (this.isMoveLeft)
        this.moveRight(-this.speed);
    };
    this.connect = () => {
      this.domElement.ownerDocument.addEventListener("mousemove", this.HandleMouseMove);
      this.domElement.ownerDocument.addEventListener("keyup", this.handleKeyUp);
      this.domElement.ownerDocument.addEventListener("keydown", this.handleKeyDown);
    };
    this.disconnect = () => {
      this.domElement.ownerDocument.removeEventListener("mousemove", this.HandleMouseMove);
      this.domElement.ownerDocument.removeEventListener("keyup", this.handleKeyUp);
      this.domElement.ownerDocument.removeEventListener("keydown", this.handleKeyDown);
    };
    this.unlock = () => {
      this.domElement.ownerDocument.exitPointerLock();
      this.isLocked = false;
    };
    this.lock = () => {
      this.domElement.requestPointerLock();
      this.isLocked = true;
    };
    this.update = () => {
      this.checkMove();
    };
    this.isMoveForward = false;
    this.isMoveBackward = false;
    this.isMoveLeft = false;
    this.isMoveRight = false;
    this.canJump = false;
    this.speed = 0.05;
    this.camera = camera;
  }
}
