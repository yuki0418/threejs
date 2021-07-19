import * as THREE from "../../_snowpack/pkg/three.js";
import {GLTFLoader} from "../../_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";
import View from "../../dist/View.js";
let view;
let panels = [];
let token;
let currentPosi = 1;
let velocity = new THREE.Vector3(0, 0, 0);
let speed = new THREE.Vector3(0.1, 0.1, 0.1);
let target = new THREE.Vector3(0, 0, 0);
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
  view.lights[1].position.set(10, 10, -10);
  initSugorokuGltf();
  document.getElementById("btnGo")?.addEventListener("click", go, false);
  document.getElementById("btnBack")?.addEventListener("click", back, false);
  view.run(update);
};
const update = (time) => {
  let desired = target.clone().sub(token.position);
  token.translateX(desired.x * speed.x);
};
const initSugorokuGltf = async () => {
  const gltfLoader = new GLTFLoader();
  const url = "./sugoroku.gltf";
  let obj = await gltfLoader.loadAsync(url);
  view.scene.add(obj.scene);
  token = obj.scene.getObjectByName("Token");
  for (let i = 1; i <= 6; i++) {
    const panel = obj.scene.getObjectByName(`Panel-${i}`);
    panels.push(panel);
  }
};
const go = () => {
  currentPosi++;
  currentPosi = Math.min(6, currentPosi);
  target.x = -(currentPosi - 1) * 3;
};
const back = () => {
  currentPosi--;
  currentPosi = Math.max(1, currentPosi);
  target.x = -(currentPosi - 1) * 3;
};
