import type PhysicsObjectOptions from "./PhysicsObjectOptions";

export default interface PhysicsCubeOptions extends PhysicsObjectOptions {
  width?: number;
  height?: number;
  depth?: number;
}