import * as THREE from "../../../_snowpack/pkg/three.js";
import * as CANNON from "../../../_snowpack/pkg/cannon-es.js";
import PhysicsObject from "./PhysicsObject.js";
export default class PhysicsFloor extends PhysicsObject {
  constructor(options) {
    const geo = new THREE.PlaneGeometry(options?.width, options?.height);
    const mat = new THREE.MeshPhongMaterial({color: 16777215});
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotateX(-Math.PI / 2);
    mesh.translateZ(-1);
    const floorShape = new CANNON.Plane();
    super(mesh, floorShape, options);
    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  }
}
