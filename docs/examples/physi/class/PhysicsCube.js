import * as THREE from "../../../_snowpack/pkg/three.js";
import * as CANNON from "../../../_snowpack/pkg/cannon-es.js";
import PhysicsObject from "./PhysicsObject.js";
export default class PhysicsCube extends PhysicsObject {
  constructor(options) {
    const width = options?.width | 2;
    const height = options?.height | 2;
    const depth = options?.depth | 2;
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mat = new THREE.MeshPhongMaterial({
      color: 65535
    });
    const mesh = new THREE.Mesh(geo, mat);
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    super(mesh, shape, options);
  }
}
