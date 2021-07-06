import View from "../../dist/View.js";
import * as THREE from "../../_snowpack/pkg/three.js";
import {GLTFLoader} from "../../_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";
export const init = async () => {
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
  console.log(objs);
  let screen = objs.scene.getObjectByName("Cube_1");
  const videoElm1 = document.getElementById("video1");
  const videoTexture = new THREE.VideoTexture(videoElm1);
  let meshMaterial = screen.material;
  meshMaterial.map = videoTexture;
  meshMaterial.needsUpdate = true;
  console.log(screen);
  view.run();
};
