import * as THREE from "../_snowpack/pkg/three.js";
import {OrbitControls} from "../_snowpack/pkg/three/examples/jsm/controls/OrbitControls.js";
import {AmbientLight, DirectionalLight, HemisphereLight} from "../_snowpack/pkg/three.js";
export default class View {
  constructor(viewOption) {
    this.init = (viewOption) => {
      const containerElm = document.getElementById(viewOption.domId);
      this.canvas = document.createElement("canvas");
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      this.canvas.style.display = "block";
      if (!containerElm)
        return;
      containerElm.appendChild(this.canvas);
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true
      });
      this.scene = new THREE.Scene();
      const mainCameraOptions = viewOption.mainCameraOption;
      this.mainCamera = new THREE.PerspectiveCamera(mainCameraOptions?.fov || 45, mainCameraOptions?.aspect || 2, mainCameraOptions?.near || 0.1, mainCameraOptions?.fov || 1e3);
      this.mainCamera.position.set(mainCameraOptions?.position.x || 0, mainCameraOptions?.position.y || 0, mainCameraOptions?.position.z || 0);
      this.mainCamera.lookAt(mainCameraOptions?.lookAt.x || 0, mainCameraOptions?.lookAt.y || 0, mainCameraOptions?.lookAt.z || 0);
      if (viewOption.orbitControls) {
        const controls = new OrbitControls(this.mainCamera, this.canvas);
        controls.target.set(0, 0, 0);
        controls.update();
      }
      {
        const state = {
          ddLights: true,
          exposure: 1,
          textureEncoding: "sRGB",
          ambientIntensity: 1,
          ambientColor: 16777215,
          directIntensity: 0.8 * Math.PI,
          directColor: 16777215,
          bgColor1: "#ffffff",
          bgColor2: "#353535"
        };
        const hemiLight = new HemisphereLight(16777147, 526368, 1);
        hemiLight.name = "hemi_light";
        this.scene.add(hemiLight);
        this.lights.push(hemiLight);
        const light1 = new AmbientLight(state.ambientColor, state.ambientIntensity);
        light1.name = "ambient_light";
        this.scene.add(light1);
        this.lights.push(light1);
        const light2 = new DirectionalLight(state.directColor, state.directIntensity);
        light2.position.set(0, 0, -3);
        light2.name = "main_light";
        this.scene.add(light2);
        this.lights.push(light2);
      }
      this.canvas.addEventListener("click", this.onViewClick, false);
      this.canvas.addEventListener("mousemove", this.onMouseMove, false);
    };
    this.onViewClick = (event) => {
      this.INTERSECTED?.dispatchEvent({type: "click"});
    };
    this.onMouseMove = (event) => {
      this.mouse.x = event.clientX / this.canvas.width * 2 - 1;
      this.mouse.y = -(event.clientY / this.canvas.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.mainCamera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        if (intersects[0].object != this.INTERSECTED) {
          if (this.INTERSECTED)
            this.INTERSECTED.dispatchEvent({type: "mouseout"});
          this.INTERSECTED = intersects[0].object;
          this.INTERSECTED.dispatchEvent({type: "hover"});
        }
      } else
        this.INTERSECTED ? this.INTERSECTED.dispatchEvent({type: "mouseout"}) : this.INTERSECTED = null;
    };
    this.lights = new Array();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(0, 0);
    this.init(viewOption);
    this.INTERSECTED = null;
  }
  run() {
    const render = (time) => {
      time *= 1e-3;
      if (this.resizeRendererToDisplaySize(this.renderer)) {
        const canvas = this.renderer.domElement;
        this.mainCamera.aspect = canvas?.clientWidth / canvas?.clientHeight;
        this.mainCamera.updateProjectionMatrix();
      }
      this.renderer.render(this.scene, this.mainCamera);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }
  resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
}
export function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
