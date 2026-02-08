import "lenis/dist/lenis.css";
import "./style.css";

import { inject } from "@vercel/analytics";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

import DispersalObject from "./DispersalObject";

inject();

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

// DONUT GEOMETRY
// const boxGeometry = new THREE.BoxGeometry(2.75, 2.75, 2.75, 20, 20, 20);
// boxGeometry.rotateY(Math.PI * 0.385);
const donutGeometry = new THREE.TorusGeometry(1.3, 0.7, 36, 80);
donutGeometry.rotateY(Math.PI * 0.385);
donutGeometry.rotateZ(Math.PI * 0.125);
// sphereGeometry.rotateY(Math.PI * 0.25);
const donut = new DispersalObject(donutGeometry);
scene.add(donut.mesh);

// box.mesh.rotation.y = Math.PI * 0.385;

// gui.add(box.mesh.position, "x").min(-100).max(-3).step(1).name("BoxX").listen();

// CAPSULE GEOMETRY
const capsuleGeometry = new THREE.CapsuleGeometry(1.25, 2, 10, 48, 16);
capsuleGeometry.rotateX(Math.PI * -0.075);
capsuleGeometry.rotateY(Math.PI * -0.125);
capsuleGeometry.rotateZ(Math.PI * -0.125);
const capsule = new DispersalObject(capsuleGeometry);
scene.add(capsule.mesh);

const isMd = window.matchMedia("(max-width: 768px)");

const xStart = { lg: -15, md: -8 };
const xEnd = { lg: -3, md: -0 };
const yPos = { lg: 0, md: -1.55 };

if (!isMd.matches) {
  sphere.mesh.position.x = -3;
  donut.mesh.position.x = xStart.lg;
  capsule.mesh.position.x = xStart.lg;

  sphere.mesh.position.y = yPos.lg;
  donut.mesh.position.y = yPos.lg;
  capsule.mesh.position.y = yPos.lg;

  sphere.mesh.scale.setScalar(1);
  donut.mesh.scale.setScalar(1);
  capsule.mesh.scale.setScalar(1);
} else {
  sphere.mesh.position.x = 0;
  donut.mesh.position.x = xStart.md;
  capsule.mesh.position.x = xStart.md;

  sphere.mesh.position.y = yPos.md;
  donut.mesh.position.y = yPos.md;
  capsule.mesh.position.y = yPos.md;

  sphere.mesh.scale.setScalar(0.7);
  donut.mesh.scale.setScalar(0.7);
  capsule.mesh.scale.setScalar(0.7);
}

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

  // Object positions
  if (!isMd.matches) {
    sphere.mesh.position.x = -3;
    donut.mesh.position.x = xStart.lg;
    capsule.mesh.position.x = xStart.lg;

    sphere.mesh.position.y = yPos.lg;
    donut.mesh.position.y = yPos.lg;
    capsule.mesh.position.y = yPos.lg;

    sphere.mesh.scale.setScalar(1);
    donut.mesh.scale.setScalar(1);
    capsule.mesh.scale.setScalar(1);
  } else {
    sphere.mesh.position.x = 0;
    donut.mesh.position.x = xStart.md;
    capsule.mesh.position.x = xStart.md;

    sphere.mesh.position.y = yPos.md;
    donut.mesh.position.y = yPos.md;
    capsule.mesh.position.y = yPos.md;

    sphere.mesh.scale.setScalar(0.7);
    donut.mesh.scale.setScalar(0.7);
    capsule.mesh.scale.setScalar(0.7);
  }
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

const mm = gsap.matchMedia();

mm.add(
  {
    isLg: "(min-width: 769px)",
    isMd: "(max-width: 768px)",
  },
  (context) => {
    const { isLg, isMd } = context.conditions;
    const tweenXStart = isLg ? xStart.lg : xStart.md;
    const tweenXEnd = isLg ? xEnd.lg : xEnd.md;

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
        x: tweenXStart,
      },
      {
        scrollTrigger: {
          trigger: ".section-2",
          start: "top 50%",
          end: "top 15%",
          scrub: true,
        },
        x: tweenXEnd,
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
        x: tweenXStart,
      },
      {
        scrollTrigger: {
          trigger: ".section-3",
          start: "top 50%",
          end: "top 15%",
          scrub: true,
        },
        x: tweenXEnd,
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
  },
);

const tick = () => {
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  requestAnimationFrame(tick);
};

tick();
