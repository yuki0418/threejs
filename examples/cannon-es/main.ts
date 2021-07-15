import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const init = () => {
  // three.js variables
  let camera: any, scene: THREE.Scene, renderer: THREE.Renderer, mouse: THREE.Vector2;

  // Objects
  let mesh: any;
  let sphereMesh: THREE.Mesh;
  let floorMesh: THREE.Mesh;
  let clickMarker: THREE.Mesh;
  let meshes: Array<THREE.Mesh> = [];

  // cannon.js variables
  let world: CANNON.World;
  let body: any;
  let sphereBody: CANNON.Body;
  let floorBody: CANNON.Body;
  const timeStep = 1 / 60;
  let lastCallTime: any;

  let isMouseDown = false;

  const initThree = () => {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Mouse
    mouse = new THREE.Vector2();

    // Camera 
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.z = 5;

    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.update();

    // Scene
    scene = new THREE.Scene();

    // Floor
    const floorGeo = new THREE.PlaneGeometry(10, 10); // 10m * 10m
    const floorMat = new THREE.MeshBasicMaterial({color: 0xffffff});
    floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotateX(-Math.PI / 2);
    floorMesh.translateZ(-1);
    scene.add(floorMesh);

    // Sphere
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({color: 0xffff00});
    sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(0, 3, 0);
    scene.add(sphereMesh);
    meshes.push(sphereMesh);

    // Box
    // const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    // const material = new THREE.MeshBasicMaterial({color: 0xff000, wireframe: true});
    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  };

  const initCannon = () => {
    world = new CANNON.World({gravity: new CANNON.Vec3(0, -5, 0)});

    // Box
    // const shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    // body = new CANNON.Body({
    //   mass: 1,
    // });
    // body.addShape(shape);
    // body.angularVelocity.set(0, 10, 0);
    // body.angularDamping = 0.5;
    // world.addBody(body);

    // Sphere
    const sphereShape = new CANNON.Sphere(1);
    sphereBody = new CANNON.Body({mass: 10, shape: sphereShape});
    sphereBody.position.copy(<any>sphereMesh.position);
    world.addBody(sphereBody);

    // Floor
    const floorShape = new CANNON.Plane();
    floorBody = new CANNON.Body({mass: 0, shape: floorShape});
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floorBody.position.set(0, -1, 0);
    world.addBody(floorBody);
  };

  const animate = () => {
    requestAnimationFrame(animate);

    // Step the physics world
    updatePysics();
    
    // Copy coordinates from cannon.js to three.js
    // mesh.position.copy(body.position);
    // mesh.quaternion.copy(body.quaternion);
    
    sphereMesh.position.copy(<any>sphereBody.position);

    render();
  };

  const updatePysics = () => {
    const time = performance.now() / 1000;
    if(!lastCallTime) {
      world.step(timeStep);
    } else {
      const dt = time - lastCallTime;
      world.step(timeStep, dt);
    };
    lastCallTime = time;
  }

  const render = () => {
    renderer.render(scene, camera);
  }

  const setClickMarker = (x: number, y: number, z: number) => {
    if(!clickMarker) {
      const shape = new THREE.SphereGeometry(0.2, 8, 8);
      clickMarker= new THREE.Mesh(shape, new THREE.MeshLambertMaterial({color: 0xff0000}));
      scene.add(clickMarker);
    }
    clickMarker.visible = true;
    clickMarker.position.set(x, y, z);
  };

  const removeClickMarker = () => {
    if(clickMarker) clickMarker.visible = false;
  }

  const onMouseDown = (e: MouseEvent) => {
    isMouseDown = true;
    let entry = findNearestIntersectingObject();
    if(!entry) return;
    let pos = entry.point;
    // Set marker on contact point
    setClickMarker(pos.x, pos.y, pos.z);
  };

  const onMouseMove = (e: MouseEvent) => {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    if(isMouseDown) {
      let entry = findNearestIntersectingObject();
      if(!entry) return;
      let pos = entry.point;
      // Set marker on contact point
      setClickMarker(pos.x, pos.y, pos.z);
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    isMouseDown = false;
    removeClickMarker();
  }

  const findNearestIntersectingObject = () => {
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    let intersect = raycaster.intersectObjects(meshes, false)[0];

    return intersect;
  }

  initThree()
  initCannon()
  animate()

  window.addEventListener('resize', onWindowResize);
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("mousedown", onMouseDown, false);
  window.addEventListener("mouseup", onMouseUp, false);
}