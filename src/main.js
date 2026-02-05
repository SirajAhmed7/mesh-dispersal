import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import vertexShader from "./shaders/faces/vertex.glsl";
import fragmentShader from "./shaders/faces/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = await textureLoader.loadAsync(
  "./textures/matcaps/gold-silver-128px.png",
);
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.IcosahedronGeometry(2, 20);
// const geometry = new THREE.PlaneGeometry(4, 4, 32, 32);
// geometry.toNonIndexed();

const vertexCount = geometry.attributes.position.count;
const positionsArray = geometry.getAttribute("position").array;

const colorInstane = new THREE.Color();

const colorArray = new Float32Array(vertexCount * 3);
const endPositionArray = new Float32Array(vertexCount);
// const delayArray = new Float32Array(vertexCount);
const centroidArray = new Float32Array(vertexCount * 3);

// for (let i = 0; i < vertexCount / 3; i++) {
//   const i9 = i * 9; // Each triangle has 3 vertices × 3 color components = 9 values

//   const color = colorInstane.setRGB(
//     Math.random(),
//     Math.random(),
//     Math.random(),
//     THREE.SRGBColorSpace,
//   );

//   // First vertex
//   colorArray[i9 + 0] = color.r;
//   colorArray[i9 + 1] = color.g;
//   colorArray[i9 + 2] = color.b;

//   // Second vertex (3 positions later)
//   colorArray[i9 + 3] = color.r;
//   colorArray[i9 + 4] = color.g;
//   colorArray[i9 + 5] = color.b;

//   // Third vertex (6 positions later)
//   colorArray[i9 + 6] = color.r;
//   colorArray[i9 + 7] = color.g;
//   colorArray[i9 + 8] = color.b;
// }

// for (let i = 0; i < vertexCount / 3; i++) {
//   const color = colorInstane.setRGB(
//     Math.random(),
//     Math.random(),
//     Math.random(),
//     THREE.SRGBColorSpace,
//   );

//   // Each triangle has 3 vertices, assign the same color to all 3 vertices
//   for (let j = 0; j < 3; j++) {
//     const vertexIndex = i * 3 + j; // Get the vertex index for this triangle
//     colorArray[vertexIndex * 3] = color.r;
//     colorArray[vertexIndex * 3 + 1] = color.g;
//     colorArray[vertexIndex * 3 + 2] = color.b;
//   }
// }

for (let i = 0; i < vertexCount / 3; i++) {
  const color = colorInstane.setRGB(
    Math.random(),
    Math.random(),
    Math.random(),
    THREE.SRGBColorSpace,
  );

  let centroid = new THREE.Vector3();

  // Each triangle has 3 vertices, assign the same color to all 3 vertices
  for (let j = 0; j < 3; j++) {
    const vertexIndex = i * 3 + j; // Get the vertex index for this triangle
    colorArray[vertexIndex * 3] = color.r;
    colorArray[vertexIndex * 3 + 1] = color.g;
    colorArray[vertexIndex * 3 + 2] = color.b;

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
  endPositionArray[i3] = randomEndPosition;
  endPositionArray[i3 + 1] = randomEndPosition;
  endPositionArray[i3 + 2] = randomEndPosition;
}

geometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
geometry.setAttribute(
  "aMovementStrength",
  new THREE.BufferAttribute(endPositionArray, 1),
);
// geometry.setAttribute("aDelay", new THREE.BufferAttribute(delayArray, 1));
geometry.setAttribute("aCentroid", new THREE.BufferAttribute(centroidArray, 3));

// for (let i = 0; i < vertexCount; i += 3) {
//   endPositionArray[i] = Math.random();
//   delayArray[i] = Math.random();
// }
// Material
// const material = new THREE.MeshMatcapMaterial({
//   // color: "cyan",
//   matcap: matcapTexture,
//   // wireframe: true,
// });

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  vertexColors: true,
  uniforms: {
    uTime: new THREE.Uniform(0),
    uMatcap: new THREE.Uniform(matcapTexture),
  },
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);

/**
 * Animate
 */
const timer = new THREE.Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update uniforms
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
