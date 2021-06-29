import {resizeRendererToDisplaySize} from "../../dist/view.js";
import * as THREE from "../../_snowpack/pkg/three.js";
import {GLTFLoader} from "../../_snowpack/pkg/three/examples/jsm/loaders/GLTFLoader.js";
import {AmbientLight, DirectionalLight, HemisphereLight} from "../../_snowpack/pkg/three.js";
import {FPSControls} from "../../dist/FPSControls.js";
export const init = async () => {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
  const scene = new THREE.Scene();
  const gltfLoader = new GLTFLoader();
  const url = "./scene.gltf";
  let objs = await gltfLoader.loadAsync(url);
  scene.add(objs.scene);
  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 1e3;
  let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(5, 1, -4);
  camera.lookAt(0, 0, 100);
  const fpsControls = new FPSControls(camera, canvas);
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");
  instructions.addEventListener("click", function() {
    fpsControls.lock();
  });
  fpsControls.addEventListener("lock", function() {
    fpsControls.connect();
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  fpsControls.addEventListener("unlock", function() {
    fpsControls.disconnect();
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  {
    const state = {
      ddLights: true,
      exposure: 1,
      textureEncoding: "sRGB",
      ambientIntensity: 0.3,
      ambientColor: 16777215,
      directIntensity: 0.8 * Math.PI,
      directColor: 16777215,
      bgColor1: "#ffffff",
      bgColor2: "#353535"
    };
    const hemiLight = new HemisphereLight();
    hemiLight.name = "hemi_light";
    scene.add(hemiLight);
    const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
    light1.name = "ambient_light";
    scene.add(light1);
    const light2 = new DirectionalLight(state.directColor, state.directIntensity);
    light2.position.set(0.5, 0, 4);
    light2.name = "main_light";
    scene.add(light2);
  }
  function update() {
    fpsControls.update();
  }
  function render(time) {
    time *= 1e-3;
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas2 = renderer.domElement;
      camera.aspect = canvas2.clientWidth / canvas2.clientHeight;
      camera.updateProjectionMatrix();
    }
    ;
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
};
