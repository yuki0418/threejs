import View from "../../dist/View.js";
import * as THREE from "../../_snowpack/pkg/three.js";
import {GLTFLoader} from "../../_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";
import {Vector2} from "../../_snowpack/pkg/three.js";
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
  let screen = objs.scene.getObjectByName("Cube_1");
  const videoElm1 = document.getElementById("video1");
  const videoTexture = new THREE.VideoTexture(videoElm1);
  videoTexture.center = new Vector2(0.5, 0.5);
  videoTexture.repeat.y = -1;
  let meshMaterial = screen.material;
  meshMaterial.map = videoTexture;
  meshMaterial.needsUpdate = true;
  document.getElementById("btnPlay")?.addEventListener("click", () => {
    var playPromise = videoElm1.play();
    if (playPromise !== void 0) {
      playPromise.then((_) => {
      }).catch((error) => {
        alert("Loading video, please try again after 5s");
      });
    }
  });
  view.run();
};
