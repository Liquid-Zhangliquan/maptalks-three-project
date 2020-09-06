precision highp float;
precision highp int;
attribute vec2 maxUv;
varying vec2 vUv;
void main(){
  vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  vUv=uv;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}