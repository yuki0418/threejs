import * as THREE from "three";
import * as CANNON from "cannon-es";
import View, { MainCameraOption, ViewOption } from "../../src/View";
import PhysicsShpere from "./class/PhysicsShpere";
import type PhysicsShpereOptions from "./interface/PhysicsShpereOptions";
import PhysicsFloor from "./class/PhysicsFloor";
import type PhysicsFloorOptions from "./interface/PhysicsFloorOptions";
import type PhysicsObject from "./class/PhysicsObject";
import PhysicsCube from "./class/PhysicsCube";

let objects: Array<PhysicsObject> = [];
let world: CANNON.World;
let view: View;
let lastCallTime: any;
const timeStep = 1 / 60;

export const init = () => {
  const mainCameraOption: MainCameraOption = {
    fov: 45,
    aspect: 2,
    near: 0.1,
    far: 1000,
    position: new THREE.Vector3(0, 0, 20),
    lookAt: new THREE.Vector3(0,0,0),
  }

  const viewOption: ViewOption = {
    domId: 'canvas',
    mainCameraOption: mainCameraOption,
    orbitControls: true,
  }
  view = new View(viewOption);
  view.lights[1].position.set(10, 10, 10);
  view.lights[1].intensity = 0.3;

  // create world
  world = new CANNON.World({gravity: new CANNON.Vec3(0, -15, 0)});

  initFloor();

  view.run(update);

  document.getElementById('btnSphere')?.addEventListener('click', addSphere, false);
  document.getElementById('btnCube')?.addEventListener('click', addCube, false);
}

const initFloor = () => {
  const floorOptions: PhysicsFloorOptions = {
    mass: 0,
    position: new CANNON.Vec3(0, -2, 0),
    height: 40,
    width: 40,
  }
  const floor = new PhysicsFloor(floorOptions);
  floor.addIntoWorld(world);
  floor.addIntoScene(view.scene);
}

const addSphere = () => {
  const objOption: PhysicsShpereOptions = {
    position: new THREE.Vector3(0, 5, 0),
    mass: 10,
    radius: 1,
  }
  const sphere = new PhysicsShpere(objOption);
  sphere.addIntoScene(view.scene);
  sphere.addIntoWorld(world);
  objects.push(sphere);
};

const addCube = () => {
  const objOption = {
    position: new THREE.Vector3(0, 5, 0),
    mass: 10,
  };
  const cube = new PhysicsCube(objOption);
  cube.addIntoScene(view.scene);
  cube.addIntoWorld(world);
  objects.push(cube);
}

const updatePysics = () => {
  const time = performance.now() / 1000;
  if(!lastCallTime) {
    world.step(timeStep);
  } else {
    const dt = time - lastCallTime;
    world.step(timeStep, dt);
  };
  lastCallTime = time;
}

const updateThreeObjs = () => {
  for(let obj of objects) {
    obj.update();
  };
}

const update = () => {
  updatePysics();
  updateThreeObjs();
}