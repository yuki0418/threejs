import View, { MainCameraOption, ViewOption } from '../../src/View';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const init = async () => {
  const mainCameraOption: MainCameraOption = {
    fov: 80,
    aspect: 2,
    near: 0.5,
    far: 5000,
    position: new THREE.Vector3(0, 0, 20),
    lookAt: new THREE.Vector3(0,0,0),
  }

  const viewOption: ViewOption = {
    domId: 'canvas',
    mainCameraOption: mainCameraOption,
    orbitControls: true,
  }

  let view = new View(viewOption);
  view.lights[view.lights.length-1].position.set(-3,3,5);
  view.renderer.outputEncoding = THREE.sRGBEncoding;

  // Add bg image
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    './abema-tower.png',
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(view.renderer, texture);
      rt.texture.rotation = 100;
      view.scene.background = rt.texture;
    });

  // Add object
  const gltfLoader = new GLTFLoader();
  const url = './abema.gltf';
  let objs = await gltfLoader.loadAsync(url);
  objs.scene.rotateY(Math.PI/2);
  objs.scene.rotateZ(-Math.PI/2);
  objs.scene.translateY(-1);

  let pivot = new THREE.Group();
  pivot.position.set( 0, 0, 0 );
  pivot.add(objs.scene);
  
  view.scene.add(pivot);

  const update = (time: number) => {
    pivot.rotateY(-0.02);
  }
  
  view.run(update);
}