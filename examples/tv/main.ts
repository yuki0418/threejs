import View, { MainCameraOption, ViewOption } from '../../src/View';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, Vector2 } from 'three';

export const init = async () => {
  let isScreenOn = false;
  let currentChannel = 0;
  let screenDefoMap: THREE.Texture;
  const mainCameraOption: MainCameraOption = {
    fov: 45,
    aspect: 2,
    near: 0.5,
    far: 1000,
    position: new THREE.Vector3(0, 0, -3),
    lookAt: new THREE.Vector3(0,0,0),
  }

  const viewOption: ViewOption = {
    domId: 'canvas',
    mainCameraOption: mainCameraOption,
    orbitControls: true,
  }

  let view = new View(viewOption);

  view.scene.background = new THREE.Color('#555');

  // Add object
  const gltfLoader = new GLTFLoader();
  const url = './tv.gltf';
  let objs = await gltfLoader.loadAsync(url);
  objs.scene.rotateY(Math.PI);
  objs.scene.translateY(-0.7);
  view.scene.add(objs.scene);
  
  let screen = <THREE.Mesh>objs.scene.getObjectByName("Cube_1");
  const videoElm1 = <HTMLVideoElement>document.getElementById('video1');
  const videoTexture1 = new THREE.VideoTexture(videoElm1);
  const videoElm2 = <HTMLVideoElement>document.getElementById('video2');
  const videoTexture2 = new THREE.VideoTexture(videoElm2);
  const videoElm3 = <HTMLVideoElement>document.getElementById('video3');
  const videoTexture3 = new THREE.VideoTexture(videoElm3);
  videoTexture1.center = new Vector2(0.5, 0.5);
  videoTexture1.repeat.y = - 1;
  videoTexture2.center = new Vector2(0.5, 0.5);
  videoTexture2.repeat.y = - 1;
  videoTexture3.center = new Vector2(0.5, 0.5);
  videoTexture3.repeat.y = - 1;
  let videoTexs = [videoTexture1, videoTexture2, videoTexture3];
  let screenMat = <MeshStandardMaterial>screen.material;
  screenDefoMap = <THREE.Texture>screenMat.map;

  let controlerMesh = <THREE.Mesh>objs.scene.getObjectByName("Selector");
  controlerMesh?.addEventListener('click', (e) => changeChannel());
  controlerMesh?.addEventListener('hover', (e) => { document.body.style.cursor = 'pointer'; });
  controlerMesh?.addEventListener('mouseout', (e) => { document.body.style.cursor = 'unset'; });
  
  let powerSwitch = <THREE.Mesh>objs.scene.getObjectByName("Switch");
  powerSwitch?.addEventListener('click', (e) => isScreenOn ? offScreen() : onScreen());
  powerSwitch?.addEventListener('hover', (e) => { document.body.style.cursor = 'pointer'; });
  powerSwitch?.addEventListener('mouseout', (e) => { document.body.style.cursor = 'unset'; });
  
  const onScreen = async () => {
    await videoElm1.play();
    await videoElm2.play();
    await videoElm3.play();
    screenMat.map = videoTexs[currentChannel];
    screenMat.needsUpdate = true;
    isScreenOn = true;
  }
  
  const offScreen = async () => {
    isScreenOn = false;
    screenMat.map = screenDefoMap;
  };

  const changeChannel = () => {
    if(!isScreenOn) return;
    if(currentChannel == 2) currentChannel = 0;
    else currentChannel++;

    screenMat.map = videoTexs[currentChannel];
    screenMat.needsUpdate = true;
  }

  view.run();
}