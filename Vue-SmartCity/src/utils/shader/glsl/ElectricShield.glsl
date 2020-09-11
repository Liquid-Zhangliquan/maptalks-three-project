#extension GL_OES_standard_derivatives : enable
uniform vec3 color;
uniform float opacity;
uniform float time;
varying vec2 vUv;
#define pi 3.1415926535
#define PI2RAD .01745329252
#define TWO_PI (2. * PI)
float rands(float p) { return fract(sin(p) * 10000.); }
float noise(vec2 p) {
  float t = time / 20000.;
  if (t > 1.)
    t -= floor(t);
  return rands(p.x * 14. + p.y * sin(t) * .5);
}
vec2 sw(vec2 p) { return vec2(floor(p.x), floor(p.y)); }
vec2 se(vec2 p) { return vec2(ceil(p.x), floor(p.y)); }
vec2 nw(vec2 p) { return vec2(floor(p.x), ceil(p.y)); }
vec2 ne(vec2 p) { return vec2(ceil(p.x), ceil(p.y)); }
float smoothNoise(vec2 p) {
  vec2 inter = smoothstep(0., 1., fract(p));
  float s = mix(noise(sw(p)), noise(se(p)), inter.x);
  float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
  return mix(s, n, inter.y);
}
float fbm(vec2 p) {
  float z = 2.;
  float rz = 0.;
  vec2 bp = p;
  for (float i = 1.; i < 6.; i++) {
    rz += abs((smoothNoise(p) - .5) * 2.) / z;
    z *= 2.;
    p *= 2.;
  }
  return rz;
}
void main() {
  vec2 uv = vUv;
  vec2 uv2 = vUv;
  if (uv.y < .5) {
    discard;
  }
  uv *= 4.;
  float rz = fbm(uv);
  uv /= exp(mod(time * 2., pi));
  rz *= pow(15., .9);
  gl_FragColor = mix(vec4(color, opacity) / rz, vec4(color, .1), .2);
  if (uv2.x < .05) {
    gl_FragColor = mix(vec4(color, .1), gl_FragColor, uv2.x / .05);
  }
  if (uv2.x > .95) {
    gl_FragColor = mix(gl_FragColor, vec4(color, .1), (uv2.x - .95) / .05);
  }
}