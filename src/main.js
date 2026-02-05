import "./style.css";
import "lenis/dist/lenis.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import vertexShader from "./shaders/faces/vertex.glsl";
import fragmentShader from "./shaders/faces/fragment.glsl";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis
 */
const lenis = new Lenis({
  autoRaf: true,
});

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
// scene.background = null;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = await textureLoader.loadAsync(
  // "./textures/matcaps/gold-silver-128px.png",
  // "./textures/matcaps/gray-128px.png",
  // "./textures/matcaps/green-shiny-512px.png",
  // "./textures/matcaps/orange-512px.png",
  // "./textures/matcaps/black-fresnel-128px.png",
  "./textures/matcaps/black-shiny-512px.png",
  // "./textures/matcaps/gold-128px.png",
  // "./textures/matcaps/green-blue-128px.png",
);
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Test mesh
 */
// Geometry
const sphereGeometry = new THREE.IcosahedronGeometry(2, 20);

const vertexCount = sphereGeometry.attributes.position.count;
const positionsArray = sphereGeometry.getAttribute("position").array;
const movementStrengthArray = new Float32Array(vertexCount);
const centroidArray = new Float32Array(vertexCount * 3);

for (let i = 0; i < vertexCount / 3; i++) {
  let centroid = new THREE.Vector3();

  // Each triangle has 3 vertices, assign the same color to all 3 vertices
  for (let j = 0; j < 3; j++) {
    const vertexIndex = i * 3 + j; // Get the vertex index for this triangle

    centroid.x += positionsArray[vertexIndex * 3];
    centroid.y += positionsArray[vertexIndex * 3 + 1];
    centroid.z += positionsArray[vertexIndex * 3 + 2];

    if (j === 2) {
      const i9 = i * 9; // Each triangle has 3 vertices × 3 color components = 9 values

      centroid.divideScalar(3);

      centroidArray[i9 + 0] = centroid.x;
      centroidArray[i9 + 1] = centroid.y;
      centroidArray[i9 + 2] = centroid.z;

      centroidArray[i9 + 3] = centroid.x;
      centroidArray[i9 + 4] = centroid.y;
      centroidArray[i9 + 5] = centroid.z;

      centroidArray[i9 + 6] = centroid.x;
      centroidArray[i9 + 7] = centroid.y;
      centroidArray[i9 + 8] = centroid.z;
    }
  }

  const i3 = i * 3;

  const randomEndPosition = Math.random() + 1.2;
  movementStrengthArray[i3] = randomEndPosition;
  movementStrengthArray[i3 + 1] = randomEndPosition;
  movementStrengthArray[i3 + 2] = randomEndPosition;
}

sphereGeometry.setAttribute(
  "aMovementStrength",
  new THREE.BufferAttribute(movementStrengthArray, 1),
);
// geometry.setAttribute("aDelay", new THREE.BufferAttribute(delayArray, 1));
sphereGeometry.setAttribute(
  "aCentroid",
  new THREE.BufferAttribute(centroidArray, 3),
);

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  vertexColors: true,
  // side: THREE.DoubleSide,
  uniforms: {
    // uTime: new THREE.Uniform(0),
    uMatcap: new THREE.Uniform(matcapTexture),
    uProgress: new THREE.Uniform(0),
  },
});

// gui
//   .add(material.uniforms.uProgress, "value")
//   .min(0)
//   .max(1)
//   .step(0.001)
//   .name("Progress")
//   .listen();

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);
sphere.position.x = -3;

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(0, 0, 5);
scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(0xffffff, 0);

/**
 * Animate
 */
const timer = new THREE.Timer();

// ScrollTrigger.create();
gsap.fromTo(
  material.uniforms.uProgress,
  {
    value: 0,
  },
  {
    scrollTrigger: {
      trigger: ".section-1",
      start: "top -20%",
      end: "+=100%",
      scrub: true,
    },
    value: 1,
  },
);

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update uniforms
  // material.uniforms.uTime.value = elapsedTime;

  // // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
