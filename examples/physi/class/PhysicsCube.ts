import * as THREE from "three";
import * as CANNON from "cannon-es";
import PhysicsObject from "./PhysicsObject";
import type PhysicsCubeOptions from "../interface/PhysicsCubeOptions";

export default class PhysicsCube extends PhysicsObject {
  constructor(
    options?: PhysicsCubeOptions
  ) {
    const width = <number>options?.width | 2;
    const height = <number>options?.height | 2;
    const depth = <number>options?.depth | 2;
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2));

    super(mesh, shape, options);
  }
}