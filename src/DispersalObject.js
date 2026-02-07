import * as THREE from "three";

import vertexShader from "./shaders/faces/vertex.glsl";
import fragmentShader from "./shaders/faces/fragment.glsl";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = await textureLoader.loadAsync(
  // "./textures/matcaps/gold-silver-128px.png",
  // "./textures/matcaps/gray-128px.png",
  // "./textures/matcaps/green-shiny-512px.png",
  // "./textures/matcaps/orange-512px.png",
  "./textures/matcaps/black-fresnel-128px.png",
  // "./textures/matcaps/black-shiny-512px.png",
  // "./textures/matcaps/gold-128px.png",
  // "./textures/matcaps/green-blue-128px.png",
);
matcapTexture.colorSpace = THREE.SRGBColorSpace;

export default class DispersalObject {
  constructor(geometry) {
    this.geometry = geometry;
    if (this.geometry.index !== null) {
      this.geometry = this.geometry.toNonIndexed();
    }

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      vertexColors: true,
      // wireframe: true,
      // side: THREE.DoubleSide,
      uniforms: {
        // uTime: new THREE.Uniform(0),
        uMatcap: new THREE.Uniform(matcapTexture),
        uProgress: new THREE.Uniform(0),
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.setupAttributes();
  }

  setupAttributes() {
    const vertexCount = this.geometry.attributes.position.count;
    const positionsArray = this.geometry.getAttribute("position").array;
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

    this.geometry.setAttribute(
      "aMovementStrength",
      new THREE.BufferAttribute(movementStrengthArray, 1),
    );
    // geometry.setAttribute("aDelay", new THREE.BufferAttribute(delayArray, 1));
    this.geometry.setAttribute(
      "aCentroid",
      new THREE.BufferAttribute(centroidArray, 3),
    );
  }
}
