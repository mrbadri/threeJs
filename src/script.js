import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { PointLightHelper } from 'three';

// loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/textures/NormalMap.png');

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x292929);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// --- light red
const pointLightRed = new THREE.PointLight(0xff0000, 1);
pointLightRed.position.set(-1.8, 1, -1.6);
pointLightRed.intensity = 10;
scene.add(pointLightRed);

const guiLightRed = gui.addFolder('light-red');

guiLightRed.add(pointLightRed.position, 'x').min(-3).max(3).step(0.01);
guiLightRed.add(pointLightRed.position, 'y').min(-6).max(6).step(0.01);
guiLightRed.add(pointLightRed.position, 'z').min(-3).max(3).step(0.01);
guiLightRed.add(pointLightRed, 'intensity').min(0).max(10).step(0.01);

// const pointLightRedHelper = new THREE.PointLightHelper(pointLightRed, 1);
// scene.add(pointLightRedHelper)

// --- light blue
const pointLightBlue = new THREE.PointLight(0xe1ff, 1);
pointLightBlue.position.set(2.13, -3, -1.98);
pointLightBlue.intensity = 6.8;
scene.add(pointLightBlue);

const guiLightBlue = gui.addFolder('light-blue');

guiLightBlue.add(pointLightBlue.position, 'x').min(-3).max(3).step(0.01);
guiLightBlue.add(pointLightBlue.position, 'y').min(-6).max(6).step(0.01);
guiLightBlue.add(pointLightBlue.position, 'z').min(-3).max(3).step(0.01);
guiLightBlue.add(pointLightBlue, 'intensity').min(0).max(10).step(0.01);

const guiLightBlueColor = {
  color: 0xff0000,
};

guiLightBlue.addColor(guiLightBlueColor, 'color').onChange(() => {
  pointLightBlue.color.set(guiLightBlueColor.color);
});

// const pointLightBlueHelper = new THREE.PointLightHelper(pointLightBlue, 1);
// scene.add(pointLightBlueHelper)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMountMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMountMove(event) {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
}

const clock = new THREE.Clock();

const tick = () => {
  targetX = mouseX * 0.002;
  targetY = mouseY * 0.002;

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  sphere.rotation.y = 0.5 * (targetX - sphere.rotation.y);
  sphere.rotation.x = 0.5 * (targetY - sphere.rotation.x);

  pointLightBlue.position.set(2.13 + targetY, -3 + targetX, -1.98 - (targetX + targetY));
  pointLightRed.position.set(-1.8, 1, -1.6 + targetX + targetY);

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
