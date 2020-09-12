precision lowp float;
precision lowp int;
uniform vec3 color;
uniform sampler2D map;
uniform float opacity;
varying vec2 vUv;
void main() {
  vec4 tex = texture2D(map, vUv);
  gl_FragColor = vec4(tex.rgb * color, tex.a * opacity);
}