uniform float uProgress;

attribute float aMovementStrength;
attribute vec3 aCentroid;

varying vec3 vNormal;
varying vec2 vUv;

#include ../includes/simplexNoise3d.glsl

void main() {
  // vec3 newPosition = position + normal * sin((aDelay + uTime) * 5.0) * (aMovementStrength * 0.2);

  float noiseDelay = simplexNoise3d(aCentroid) * 0.5;
  noiseDelay = smoothstep(-1.0, 1.0, noiseDelay);

  float duration = 0.4;
  float delay = (1.0 - duration) * noiseDelay; // To get a noise(random) delay value that is less than 1 - duration
  float end = delay + duration;

  float progress = smoothstep(delay, end, uProgress);

  float noiseMovement = simplexNoise3d(vec3(
    (aCentroid.x * 0.5),
    (aCentroid.y * 0.5),
    (aCentroid.z * 0.5)
  ));
  // noiseMovement = smoothstep(-1.0, 1.0, noiseMovement);

  // Particles random wind movement
  vec3 newCentroid = aCentroid * aMovementStrength;
  newCentroid.x += cos(cos(cos(uProgress * 24.0 * noiseMovement) * 3.0 + 4.0) + 7.2) * 2.0;
  newCentroid.y += sin(sin(sin(uProgress * 24.0 * noiseMovement) * 3.0 + 13.4) + 1.4) * 2.0;
  newCentroid.z += sin(sin(sin(uProgress * 24.0 * noiseMovement) * 3.0 + 2.4) + 1.2) * 2.0;

  // Wind movement effect
  newCentroid.x += 2.5;
  newCentroid.y += 0.7;
  newCentroid.z -= 5.5;

  vec3 newPosition = mix(position, newCentroid, pow(progress, 3.0));

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

  vec4 viewPosition = viewMatrix * modelPosition;

  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  // Varyings

  // Calculate view-space normal
  vNormal = normalize( normalMatrix * normal );
  
  // Pass UV coordinates to fragment shader
  vUv = uv;
}