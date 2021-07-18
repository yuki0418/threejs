import type * as CANNON from "cannon-es";
import type * as THREE from "three";

export default interface PhysicsObjectOptions {
  position: THREE.Vector3 | CANNON.Vec3;
  mass: number;
}
