import type * as THREE from "three";
import * as CANNON from "cannon-es";
import type PhysicsObjectOptions from "../interface/PhysicsObjectOptions";

export default class PhysicsObject {
  mesh: THREE.Mesh;
  body: CANNON.Body;

  constructor(
    mesh: THREE.Mesh,
    shape: CANNON.Shape,
    options?: PhysicsObjectOptions
  ) {
    this.mesh = mesh;
    this.body = new CANNON.Body({
      mass: <number>options?.mass | 0,
      shape: shape,
    });

    if (options) {
      // Set position
      this.mesh.position.set(options.position.x, options.position.y, options.position.z);
      this.body.position.copy(<any>this.mesh.position);

      // Set mass
      this.body.mass = options.mass;
    }
  }

  addIntoScene(scene: THREE.Scene) {
    scene.add(this.mesh);
  }

  addIntoWorld(world: CANNON.World) {
    world.addBody(this.body);
  }

  update = () => {
    this.mesh.position.copy(<any>this.body.position);
  }
}