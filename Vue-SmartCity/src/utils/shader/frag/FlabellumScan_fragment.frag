precision lowp float;
precision lowp int;
varying vec2 vUv;
uniform float time;
uniform vec3 color;
uniform float opacity;

#define pi 3.1415926535
#define PI2RAD 0.01745329252
#define TWO_PI (2. * PI)

void main() {
  vec2 pos = vUv - 0.5;
  float r = length(pos);
  if (r > 0.5) {
    discard;
  }
  float t = atan(pos.y, pos.x) - time * 2.5;
  float a = (atan(sin(t), cos(t)) + pi) / (2.0 * pi);
  float ta = 0.5;
  float v =
      smoothstep(ta - 0.05, ta + 0.05, a) * smoothstep(ta + 0.05, ta - 0.05, a);
  vec3 col = vec3(0, v, 0);
  float blink = pow(sin(time * 1.5) * 0.5 + 0.5, 0.8);
  gl_FragColor = vec4(color, opacity * pow(a, 8.0 * (.2 + blink)) *
                                 (sin(r * 300.0) * .5 + .5) * pow(r, 0.4));
}