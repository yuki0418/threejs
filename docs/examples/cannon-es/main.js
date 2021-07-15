import * as CANNON from "../../_snowpack/pkg/cannon-es.js";
import * as THREE from "../../_snowpack/pkg/three.js";
export const init = () => {
  let camera, scene, renderer, mouse;
  let mesh;
  let sphereMesh;
  let floorMesh;
  let clickMarker;
  let meshes = [];
  let world;
  let body;
  let sphereBody;
  let floorBody;
  const timeStep = 1 / 60;
  let lastCallTime;
  let isMouseDown = false;
  const initThree = () => {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    mouse = new THREE.Vector2();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.z = 5;
    scene = new THREE.Scene();
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.MeshBasicMaterial({color: 16777215});
    floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotateX(-Math.PI / 2);
    floorMesh.translateZ(-1);
    scene.add(floorMesh);
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({color: 16776960});
    sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(0, 3, 0);
    scene.add(sphereMesh);
    meshes.push(sphereMesh);
  };
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  const initCannon = () => {
    world = new CANNON.World({gravity: new CANNON.Vec3(0, -5, 0)});
    const sphereShape = new CANNON.Sphere(1);
    sphereBody = new CANNON.Body({mass: 10, shape: sphereShape});
    sphereBody.position.copy(sphereMesh.position);
    world.addBody(sphereBody);
    const floorShape = new CANNON.Plane();
    floorBody = new CANNON.Body({mass: 0, shape: floorShape});
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    floorBody.position.set(0, -1, 0);
    world.addBody(floorBody);
  };
  const animate = () => {
    requestAnimationFrame(animate);
    updatePysics();
    sphereMesh.position.copy(sphereBody.position);
    render();
  };
  const updatePysics = () => {
    const time = performance.now() / 1e3;
    if (!lastCallTime) {
      world.step(timeStep);
    } else {
      const dt = time - lastCallTime;
      world.step(timeStep, dt);
    }
    ;
    lastCallTime = time;
  };
  const render = () => {
    renderer.render(scene, camera);
  };
  const setClickMarker = (x, y, z) => {
    if (!clickMarker) {
      const shape = new THREE.SphereGeometry(0.2, 8, 8);
      clickMarker = new THREE.Mesh(shape, new THREE.MeshLambertMaterial({color: 16711680}));
      scene.add(clickMarker);
    }
    clickMarker.visible = true;
    clickMarker.position.set(x, y, z);
  };
  const removeClickMarker = () => {
    if (clickMarker)
      clickMarker.visible = false;
  };
  const onMouseDown = (e) => {
    isMouseDown = true;
    let entry = findNearestIntersectingObject();
    if (!entry)
      return;
    let pos = entry.point;
    setClickMarker(pos.x, pos.y, pos.z);
  };
  const onMouseMove = (e) => {
    mouse.x = e.clientX / window.innerWidth * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (isMouseDown) {
      let entry = findNearestIntersectingObject();
      if (!entry)
        return;
      let pos = entry.point;
      setClickMarker(pos.x, pos.y, pos.z);
    }
  };
  const onMouseUp = (e) => {
    isMouseDown = false;
    removeClickMarker();
  };
  const findNearestIntersectingObject = () => {
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    let intersect = raycaster.intersectObjects(meshes, false)[0];
    return intersect;
  };
  initThree();
  initCannon();
  animate();
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", onMouseMove, false);
  window.addEventListener("mousedown", onMouseDown, false);
  window.addEventListener("mouseup", onMouseUp, false);
};
