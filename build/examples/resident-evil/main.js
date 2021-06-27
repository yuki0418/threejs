import * as THREE from '../../_snowpack/pkg/three.js';
// import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.129.0-chk6X8RSBl37CcZQlxof/mode=imports,min/optimized/three.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/jsm/loaders/GLTFLoader.js';
import { AmbientLight, DirectionalLight, HemisphereLight } from '../../_snowpack/pkg/three.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';


// import GLTFMaterialsVariantsExtension from '../libs/three-gltf-extensions-main/loaders/KHR_materials_variants/KHR_materials_variants.js';
// import GLTFInstancingExtension from '../libs/three-gltf-extensions-main/loaders/EXT_mesh_gpu_instancing/EXT_mesh_gpu_instancing.js';
// import GLTFTextureDDSExtension from '../libs/three-gltf-extensions-main/loaders/MSFT_texture_dds/MSFT_texture_dds.js';

export async function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas, alpha: true,});
  renderer.outputEncoding = THREE.sRGBEncoding;

  const fov = 80;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 8;
  camera.position.y = 1;
  const lights = [];

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  const scene = new THREE.Scene();

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
    lights.push(hemiLight);

    const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
    light1.name = 'ambient_light';
    scene.add(light1);

    const light2 = new DirectionalLight(state.directColor, state.directIntensity);
    light2.position.set(0.5, 0, 4);
    light2.name = 'main_light';
    scene.add(light2);
  }

  // Add light
  // {
  //   const color = 0xFFFFFF;
  //   const intensity = 1;
  //   const light = new THREE.DirectionalLight(color, intensity);
  //   light.position.set(-1, 2, 4);
  //   scene.add(light);
  // }

  // Add light 2
  // {
  //   const light = new THREE.PointLight(0xffffff, 2);
  //   light.position.set(0, 0, 10);
  //   scene.add(light);
  // }

  
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
    () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    });
  


  // Add triforce
  const gltfLoader = new GLTFLoader();
  let obj;
  let meshes = [];

  // gltfLoader.setMaterials(mtlTriforce);
  // gltfLoader.register(parser => new GLTFMaterialsVariantsExtension(parser));
  // gltfLoader.register(parser => new GLTFInstancingExtension(parser));
  // gltfLoader.register(parser => new GLTFTextureDDSExtension(parser));
  gltfLoader.load('logo.gltf',
    gltf => {
      obj = gltf;
      console.log(obj);
      scene.add( obj.scene );
      for(let child of obj.scene.children) {
        if(child.type === "Mesh") {
          // console.log(child.material);
          child.material.roughness = 0.3;
          child.material.envMaps = texture;
          meshes.push(child);
        }
      };
    },
    xhr => {
      // called when loading is in progresses
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    err => {
      console.log(err);
    }
  );    

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };

    // update cube
    const speed = 1;
    const rot = time * speed;

    if(meshes.length > 0) {
      meshes.forEach(mesh => {
        mesh.rotation.y = -rot;
      });
    }

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}