precision lowp float;
precision lowp int;
varying vec2 vUv;
uniform vec3 color;
uniform float time;
uniform float opacity;
void main(){
  vec2 uv=vUv;
  float scaleY=.7+.3*sin(time);
  vec4 gradient=mix(vec4(color,opacity),
  vec4(0.,0.,0.,0.),min(1.,uv.y/scaleY));
  gl_FragColor=mix(mix(vec4(vec3(0.),1),gradient,gradient.a),vec4(vec3(0.),1),smoothstep(scaleY-.00001,scaleY,uv.y));
}