precision lowp float;
precision lowp int;
#ifdef USE_FOG
varying float fogDepth;
#endif
varying vec2 vUv;
void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
#ifdef USE_FOG
  fogDepth = -mvPosition.z;
#endif
}