import type * as CANNON from "cannon-es";
import type * as THREE from "three";
import type PhysicsObjectOptions from "./PhysicsObjectOptions";

export default interface PhysicsShpereOptions extends PhysicsObjectOptions {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
}