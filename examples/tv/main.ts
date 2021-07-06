import View, { MainCameraOption, ViewOption } from '../../src/View';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshStandardMaterial, Vector2 } from 'three';

export const init = async () => {
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

  // Add object
  const gltfLoader = new GLTFLoader();
  const url = './tv.gltf';
  let objs = await gltfLoader.loadAsync(url);
  objs.scene.rotateY(Math.PI);
  objs.scene.translateY(-0.7);
  view.scene.add(objs.scene);
  
  let screen = <THREE.Mesh>objs.scene.getObjectByName("Cube_1");
  const videoElm1 = <HTMLVideoElement>document.getElementById('video1');
  const videoTexture = new THREE.VideoTexture(videoElm1);
  videoTexture.center = new Vector2(0.5, 0.5);
  videoTexture.repeat.y = - 1;
  let meshMaterial = <MeshStandardMaterial>screen.material;
  meshMaterial.map = videoTexture;
  meshMaterial.needsUpdate = true;

  document.getElementById('btnPlay')?.addEventListener('click', () => {
    var playPromise = videoElm1.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        // Automatic playback started!
        // Show playing UI.
      })
      .catch(error => {
        // Auto-play was prevented
        // Show paused UI.
        alert("Loading video, please try again after 5s");
      });
    }
  });

  view.run();
}