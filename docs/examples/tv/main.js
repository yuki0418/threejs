import View from "../../dist/View.js";
import * as THREE from "../../_snowpack/pkg/three.js";
import {GLTFLoader} from "../../_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";
import {Vector2} from "../../_snowpack/pkg/three.js";
export const init = async () => {
  let isScreenOn = false;
  let currentChannel = 0;
  let screenDefoMap;
  const mainCameraOption = {
    fov: 45,
    aspect: 2,
    near: 0.5,
    far: 1e3,
    position: new THREE.Vector3(0, 0, -3),
    lookAt: new THREE.Vector3(0, 0, 0)
  };
  const viewOption = {
    domId: "canvas",
    mainCameraOption,
    orbitControls: true
  };
  let view = new View(viewOption);
  const gltfLoader = new GLTFLoader();
  const url = "./tv.gltf";
  let objs = await gltfLoader.loadAsync(url);
  objs.scene.rotateY(Math.PI);
  objs.scene.translateY(-0.7);
  view.scene.add(objs.scene);
  let screen = objs.scene.getObjectByName("Cube_1");
  const videoElm1 = document.getElementById("video1");
  const videoTexture1 = new THREE.VideoTexture(videoElm1);
  const videoElm2 = document.getElementById("video2");
  const videoTexture2 = new THREE.VideoTexture(videoElm2);
  const videoElm3 = document.getElementById("video3");
  const videoTexture3 = new THREE.VideoTexture(videoElm3);
  videoTexture1.center = new Vector2(0.5, 0.5);
  videoTexture1.repeat.y = -1;
  videoTexture2.center = new Vector2(0.5, 0.5);
  videoTexture2.repeat.y = -1;
  videoTexture3.center = new Vector2(0.5, 0.5);
  videoTexture3.repeat.y = -1;
  let videoTexs = [videoTexture1, videoTexture2, videoTexture3];
  let screenMat = screen.material;
  screenDefoMap = screenMat.map;
  let controlerMesh = objs.scene.getObjectByName("Selector");
  controlerMesh?.addEventListener("click", (e) => changeChannel());
  controlerMesh?.addEventListener("hover", (e) => {
    document.body.style.cursor = "pointer";
  });
  controlerMesh?.addEventListener("mouseout", (e) => {
    document.body.style.cursor = "unset";
  });
  let powerSwitch = objs.scene.getObjectByName("Switch");
  powerSwitch?.addEventListener("click", (e) => isScreenOn ? offScreen() : onScreen());
  powerSwitch?.addEventListener("hover", (e) => {
    document.body.style.cursor = "pointer";
  });
  powerSwitch?.addEventListener("mouseout", (e) => {
    document.body.style.cursor = "unset";
  });
  const onScreen = async () => {
    await videoElm1.play();
    await videoElm2.play();
    await videoElm3.play();
    screenMat.map = videoTexs[currentChannel];
    screenMat.needsUpdate = true;
    isScreenOn = true;
  };
  const offScreen = async () => {
    isScreenOn = false;
    screenMat.map = screenDefoMap;
  };
  const changeChannel = () => {
    if (!isScreenOn)
      return;
    if (currentChannel == 2)
      currentChannel = 0;
    else
      currentChannel++;
    screenMat.map = videoTexs[currentChannel];
    screenMat.needsUpdate = true;
  };
  view.run();
};
