import * as THREE from "../../_snowpack/pkg/three.js";
import * as CANNON from "../../_snowpack/pkg/cannon-es.js";
import View from "../../dist/View.js";
import PhysicsShpere from "./class/PhysicsShpere.js";
import PhysicsFloor from "./class/PhysicsFloor.js";
import PhysicsCube from "./class/PhysicsCube.js";
let objects = [];
let world;
let view;
let lastCallTime;
const timeStep = 1 / 60;
export const init = () => {
  const mainCameraOption = {
    fov: 45,
    aspect: 2,
    near: 0.1,
    far: 1e3,
    position: new THREE.Vector3(0, 0, 20),
    lookAt: new THREE.Vector3(0, 0, 0)
  };
  const viewOption = {
    domId: "canvas",
    mainCameraOption,
    orbitControls: true
  };
  view = new View(viewOption);
  view.lights[1].position.set(10, 10, 10);
  view.lights[1].intensity = 0.3;
  world = new CANNON.World({gravity: new CANNON.Vec3(0, -15, 0)});
  initFloor();
  view.run(update);
  document.getElementById("btnSphere")?.addEventListener("click", addSphere, false);
  document.getElementById("btnCube")?.addEventListener("click", addCube, false);
};
const initFloor = () => {
  const floorOptions = {
    mass: 0,
    position: new CANNON.Vec3(0, -2, 0),
    height: 40,
    width: 40
  };
  const floor = new PhysicsFloor(floorOptions);
  floor.addIntoWorld(world);
  floor.addIntoScene(view.scene);
};
const addSphere = () => {
  const objOption = {
    position: new THREE.Vector3(0, 5, 0),
    mass: 10,
    radius: 1
  };
  const sphere = new PhysicsShpere(objOption);
  sphere.addIntoScene(view.scene);
  sphere.addIntoWorld(world);
  objects.push(sphere);
};
const addCube = () => {
  const objOption = {
    position: new THREE.Vector3(0, 5, 0),
    mass: 10
  };
  const cube = new PhysicsCube(objOption);
  cube.addIntoScene(view.scene);
  cube.addIntoWorld(world);
  objects.push(cube);
};
const updatePysics = () => {
  const time = performance.now() / 1e3;
  if (!lastCallTime) {
    world.step(timeStep);
  } else {
    const dt = time - lastCallTime;
    world.step(timeStep, dt);
  }
  ;
  lastCallTime = time;
};
const updateThreeObjs = () => {
  for (let obj of objects) {
    obj.update();
  }
  ;
};
const update = () => {
  updatePysics();
  updateThreeObjs();
};
