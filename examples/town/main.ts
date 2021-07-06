import { resizeRendererToDisplaySize } from '../../src/View';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AmbientLight, DirectionalLight, HemisphereLight } from 'three';
import { FPSControls } from '../../src/FPSControls';

export const init = async () => {
  const canvas = <HTMLCanvasElement>document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true,});
  const scene = new THREE.Scene();

  // Add object
  const gltfLoader = new GLTFLoader();
  const url = './scene.gltf';
  let objs = await gltfLoader.loadAsync(url);
  scene.add(objs.scene);

  // Camera
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(5, 1, -4);
  camera.lookAt(0, 0, 100);

  const fpsControls = new FPSControls(camera, canvas);

  const blocker: HTMLElement = <HTMLElement>document.getElementById( 'blocker' );
  const instructions: HTMLElement = <HTMLElement>document.getElementById( 'instructions' );

  instructions.addEventListener( 'click', function () {
    fpsControls.lock();
  });

  fpsControls.addEventListener( 'lock', function () {
    fpsControls.connect();
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });
  
  fpsControls.addEventListener( 'unlock', function () {
    fpsControls.disconnect();
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  {
    const state = {
      ddLights: true,
      exposure: 1.0,
      textureEncoding: 'sRGB',
      ambientIntensity: 0.3,
      ambientColor: 0xFFFFFF,
      directIntensity: 0.8 * Math.PI, // TODO(#116)
      directColor: 0xFFFFFF,
      bgColor1: '#ffffff',
      bgColor2: '#353535'
    }

    const hemiLight = new HemisphereLight();
    hemiLight.name = 'hemi_light';
    scene.add(hemiLight);
    // lights.push(hemiLight);

    const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
    light1.name = 'ambient_light';
    scene.add(light1);

    const light2 = new DirectionalLight(state.directColor, state.directIntensity);
    light2.position.set(0.5, 0, 4);
    light2.name = 'main_light';
    scene.add(light2);
  }

  function update() {
    fpsControls.update();
  }

  function render(time: number) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };

    update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}