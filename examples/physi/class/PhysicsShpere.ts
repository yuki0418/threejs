import * as THREE from "three";
import * as CANNON from "cannon-es";
import PhysicsObject from "./PhysicsObject";
import type PhysicsShpereOptions from "../interface/PhysicsShpereOptions";

export default class PhysicsShpere extends PhysicsObject {
  constructor(
    options?: PhysicsShpereOptions
  ) {
    const radius = <number>options?.radius | 1;
    const widthSegments = <number>options?.widthSegments | 32;
    const heightSegments = <number>options?.heightSegments | 32;
    const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xffff00,
    });
    const mesh = new THREE.Mesh(geo, mat);
    const sphereShape = new CANNON.Sphere(radius);

    super(mesh, sphereShape, options);
  }
}