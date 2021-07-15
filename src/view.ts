import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { AmbientLight, DirectionalLight, HemisphereLight } from 'three';

export interface ViewOption {
  domId: string,
  mainCameraOption?: MainCameraOption,
  orbitControls?: boolean
}

export interface MainCameraOption {
  fov: number,
  aspect: number,
  near: number,
  far: number,
  position: THREE.Vector3,
  lookAt: THREE.Vector3
}

export default class View {
  constructor(viewOption: ViewOption) {
    this.lights = new Array();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0,0);
    this.init(viewOption);
    this.INTERSECTED = null;
  }

  canvas!: HTMLCanvasElement;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  mainCamera!: THREE.PerspectiveCamera;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  lights: Array<THREE.Light>;
  INTERSECTED: THREE.Object3D | null;

  init = (viewOption: ViewOption) => {
    // Create view element
    const containerElm = document.getElementById(viewOption.domId);
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    
    if(!containerElm) return;
    containerElm.appendChild(this.canvas);

    // Initialize THREE renderer and scene
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.scene = new THREE.Scene();

    // Initialize the main camera
    const mainCameraOptions = viewOption.mainCameraOption;
    this.mainCamera = new THREE.PerspectiveCamera(
      mainCameraOptions?.fov || 45,
      mainCameraOptions?.aspect || 2,
      mainCameraOptions?.near || 0.1,
      mainCameraOptions?.fov || 1000,
    );
    this.mainCamera.position.set(
      mainCameraOptions?.position.x || 0,
      mainCameraOptions?.position.y || 0,
      mainCameraOptions?.position.z || 0,
    )
    this.mainCamera.lookAt(
      mainCameraOptions?.lookAt.x || 0,
      mainCameraOptions?.lookAt.y || 0,
      mainCameraOptions?.lookAt.z || 0,
    );

    // Add OrbitControls if needs
    if(viewOption.orbitControls) {
      const controls = new OrbitControls(this.mainCamera, this.canvas);
      controls.target.set(0, 0, 0);
      controls.update();
    }

    // Add initial lights
    {
      const state = {
        ddLights: true,
        exposure: 1.0,
        textureEncoding: 'sRGB',
        ambientIntensity: 1,
        ambientColor: 0xFFFFFF,
        directIntensity: 0.8 * Math.PI, // TODO(#116)
        directColor: 0xFFFFFF,
        bgColor1: '#ffffff',
        bgColor2: '#353535'
      }
  
      const hemiLight = new HemisphereLight(0xffffbb, 0x080820, 1);
      hemiLight.name = 'hemi_light';
      this.scene.add(hemiLight);
      this.lights.push(hemiLight);
  
      const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
      light1.name = 'ambient_light';
      this.scene.add(light1);
      this.lights.push(light1)
      
      const light2 = new DirectionalLight(state.directColor, state.directIntensity);
      light2.position.set(0, 0, -3);
      light2.name = 'main_light';
      this.scene.add(light2);
      this.lights.push(light2)
    }

    this.canvas.addEventListener('click', this.onViewClick, false);
    this.canvas.addEventListener('touchend', this.onTouchEnd, false);
    this.canvas.addEventListener('mousemove', this.onMouseMove, false);
    this.canvas.addEventListener('touchmove', this.onTouchMove, false);
  };

  run(update?: Function) {
    const render = (time: number) => {
      time *= 0.001;

      if(this.resizeRendererToDisplaySize(<THREE.WebGLRenderer>this.renderer)) {
        const canvas = this.renderer.domElement;
        this.mainCamera.aspect = canvas?.clientWidth / canvas?.clientHeight;
        this.mainCamera.updateProjectionMatrix();
      }

      if(update) {
        update(time);
      }

      this.renderer.render(this.scene, this.mainCamera);
  
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  };

  private resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer): boolean {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  private onViewClick = (event: MouseEvent): void => {
    this.INTERSECTED?.dispatchEvent({type: 'click'});
  };

  private onTouchEnd = (event: TouchEvent): void => {
    this.mouse.x = (event.changedTouches[0].clientX / this.canvas.width) * 2 - 1;
    this.mouse.y = - (event.changedTouches[0].clientY / this.canvas.height) * 2 + 1;
    this.findIntersected();
    this.INTERSECTED?.dispatchEvent({type: 'click'});
  };
  
  private onMouseMove = (event: MouseEvent): void => {
    this.mouse.x = (event.clientX / this.canvas.width) * 2 - 1;
    this.mouse.y = - (event.clientY / this.canvas.height) * 2 + 1;
    this.findIntersected();
  }

  private onTouchMove = (event: TouchEvent): void => {
    this.mouse.x = (event.touches[0].clientX / this.canvas.width) * 2 - 1;
    this.mouse.y = - (event.touches[0].clientY / this.canvas.height) * 2 + 1;
    this.findIntersected();
  }
  
  private findIntersected = () => {
    this.raycaster.setFromCamera(this.mouse, this.mainCamera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
    if (intersects.length > 0) {
      if(intersects[0].object != this.INTERSECTED) {
        // Dispach mouseout event for INTERSECTED object
        if(this.INTERSECTED) this.INTERSECTED.dispatchEvent({type: 'mouseout'});
        this.INTERSECTED = intersects[0].object;
        this.INTERSECTED.dispatchEvent({type: 'hover'});
      }
    } else 
      this.INTERSECTED ? this.INTERSECTED.dispatchEvent({type: 'mouseout'}) : this.INTERSECTED = null;
  }
}


export function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}