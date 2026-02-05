uniform sampler2D uMatcap;

varying vec3 vNormal;
varying vec2 vUv;

void main()
{
  // Map the view-space normal to a 2D UV coordinate for the matcap texture
  vec3 normal = normalize(vNormal);
  vec2 uv = normal.xy * 0.495 + 0.5; // Mapping logic
  
  // Sample the matcap texture
  vec4 matcapColor = texture2D(uMatcap, uv);

  gl_FragColor = matcapColor;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}