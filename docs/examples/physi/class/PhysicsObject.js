import * as CANNON from "../../../_snowpack/pkg/cannon-es.js";
export default class PhysicsObject {
  constructor(mesh, shape, options) {
    this.update = () => {
      this.mesh.position.copy(this.body.position);
    };
    this.mesh = mesh;
    this.body = new CANNON.Body({
      mass: options?.mass | 0,
      shape
    });
    if (options) {
      this.mesh.position.set(options.position.x, options.position.y, options.position.z);
      this.body.position.copy(this.mesh.position);
      this.body.mass = options.mass;
    }
  }
  addIntoScene(scene) {
    scene.add(this.mesh);
  }
  addIntoWorld(world) {
    world.addBody(this.body);
  }
}
