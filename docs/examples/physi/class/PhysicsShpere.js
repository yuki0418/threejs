import * as THREE from "../../../_snowpack/pkg/three.js";
import * as CANNON from "../../../_snowpack/pkg/cannon-es.js";
import PhysicsObject from "./PhysicsObject.js";
export default class PhysicsShpere extends PhysicsObject {
  constructor(options) {
    const radius = options?.radius | 1;
    const widthSegments = options?.widthSegments | 32;
    const heightSegments = options?.heightSegments | 32;
    const geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    const mat = new THREE.MeshPhongMaterial({
      color: 16776960
    });
    const mesh = new THREE.Mesh(geo, mat);
    const sphereShape = new CANNON.Sphere(radius);
    super(mesh, sphereShape, options);
  }
}
