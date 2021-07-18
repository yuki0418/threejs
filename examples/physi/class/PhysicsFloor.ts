import * as THREE from "three";
import * as CANNON from "cannon-es";
import PhysicsObject from "./PhysicsObject";
import type PhysicsFloorOptions from "../interface/PhysicsFloorOptions";

export default class PhysicsFloor extends PhysicsObject {
  constructor(
    options?: PhysicsFloorOptions
  ) {
    const geo = new THREE.PlaneGeometry(options?.width, options?.height);
    const mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotateX(-Math.PI / 2);
    mesh.translateZ(-1);

    const floorShape = new CANNON.Plane();
    
    super(mesh, floorShape, options);

    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  }
}