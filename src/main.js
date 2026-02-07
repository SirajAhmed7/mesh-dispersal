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

import Experience from "./experience/Experience";
import DispersalObject from "./DispersalObject";

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
// const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");
const experience = new Experience(canvas);

// Scene
const scene = new THREE.Scene();
// scene.background = null;

/**
 * Objects
 */

// SPHERE GEOMETRY
const sphereGeometry = new THREE.IcosahedronGeometry(2, 20);
// const sphereGeometry = new THREE.TorusGeometry(1.5, 0.8, 36, 64);
// sphereGeometry.rotateY(Math.PI * 0.25);

const sphere = new DispersalObject(sphereGeometry);
scene.add(sphere.mesh);
sphere.mesh.position.x = -3;

// DONUT GEOMETRY
// const boxGeometry = new THREE.BoxGeometry(2.75, 2.75, 2.75, 20, 20, 20);
// boxGeometry.rotateY(Math.PI * 0.385);
const donutGeometry = new THREE.TorusGeometry(1.3, 0.7, 36, 80);
donutGeometry.rotateY(Math.PI * 0.385);
donutGeometry.rotateZ(Math.PI * 0.125);
// sphereGeometry.rotateY(Math.PI * 0.25);
const donut = new DispersalObject(donutGeometry);
scene.add(donut.mesh);
donut.mesh.position.x = -15;
// box.mesh.rotation.y = Math.PI * 0.385;

// gui.add(box.mesh.position, "x").min(-100).max(-3).step(1).name("BoxX").listen();

// CAPSULE GEOMETRY
const capsuleGeometry = new THREE.CapsuleGeometry(1.25, 2, 10, 48, 16);
capsuleGeometry.rotateX(Math.PI * -0.075);
capsuleGeometry.rotateY(Math.PI * -0.125);
capsuleGeometry.rotateZ(Math.PI * -0.125);
const capsule = new DispersalObject(capsuleGeometry);
scene.add(capsule.mesh);
capsule.mesh.position.x = -15;

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

// ScrollTrigger.create();
// SPHERE
gsap.fromTo(
  sphere.material.uniforms.uProgress,
  {
    value: 0,
  },
  {
    scrollTrigger: {
      trigger: ".section-1",
      start: "top top",
      end: "+=100%",
      scrub: true,
    },
    value: 1,
  },
);

// DONUT
gsap.fromTo(
  donut.mesh.position,
  {
    x: -15,
  },
  {
    scrollTrigger: {
      trigger: ".section-2",
      start: "top 50%",
      end: "top 15%",
      scrub: true,
    },
    x: -3,
  },
);
gsap.fromTo(
  donut.material.uniforms.uProgress,
  {
    value: 0,
  },
  {
    scrollTrigger: {
      trigger: ".section-2",
      start: "top top",
      end: "+=100%",
      scrub: true,
    },
    value: 1,
  },
);

// CAPSULE
gsap.fromTo(
  capsule.mesh.position,
  {
    x: -15,
  },
  {
    scrollTrigger: {
      trigger: ".section-3",
      start: "top 50%",
      end: "top 15%",
      scrub: true,
    },
    x: -3,
  },
);
gsap.fromTo(
  capsule.material.uniforms.uProgress,
  {
    value: 0,
  },
  {
    scrollTrigger: {
      trigger: ".section-3",
      start: "top top",
      end: "+=100%",
      scrub: true,
    },
    value: 1,
  },
);

const tick = () => {
  // // Timer
  // timer.update();
  // const elapsedTime = timer.getElapsed();

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
