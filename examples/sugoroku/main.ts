import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import View, { MainCameraOption, ViewOption } from '../../src/View';

let view: View;
let panels: Array<THREE.Mesh> = [];
let token: THREE.Object3D;
let currentPosi = 1;

let velocity = new THREE.Vector3(0, 0, 0);
let speed = new THREE.Vector3(0.1, 0.1, 0.1);
let target = new THREE.Vector3(0, 0, 0);

// Token translateX x = -3n

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

  view.lights[1].position.set(10, 10, -10);

  initSugorokuGltf();

  // Add eventListeners to btns
  document.getElementById('btnGo')?.addEventListener('click', go, false);
  document.getElementById('btnBack')?.addEventListener('click', back, false);

  view.run(update);
}

const update = (time: number) => {
  let desired = target.clone().sub(token.position);
  token.translateX(desired.x * speed.x);
}

const initSugorokuGltf = async () => {
  const gltfLoader = new GLTFLoader();
  const url = './sugoroku.gltf';
  let obj = await gltfLoader.loadAsync(url);
  view.scene.add(obj.scene);

  token = <THREE.Object3D>obj.scene.getObjectByName('Token');
  for(let i = 1; i <= 6; i++) {
    const panel = obj.scene.getObjectByName(`Panel-${i}`);
    panels.push(<THREE.Mesh>panel);
  }
}

const go = () => {
  currentPosi++;
  currentPosi = Math.min(6, currentPosi);
  target.x = -(currentPosi-1) * 3;
}

const back = () => {
  currentPosi--;
  currentPosi = Math.max(1, currentPosi);
  target.x = -(currentPosi-1) * 3;
}