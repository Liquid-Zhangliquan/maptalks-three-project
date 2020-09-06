#extension GL_OES_standard_derivatives:enable
precision highp float;
precision highp int;
uniform vec3 color;
uniform float opacity;
uniform sampler2D maps[1];
varying vec2 vUv;
void main(void){
  vec2 uv=vUv;
  gl_FragColor=texture2D(maps[0],uv);
}