﻿precision lowp float;
precision lowp int;
uniform vec3 color;
uniform float opacity;
uniform float hiz;
uniform float num;
uniform float time;
varying vec2 vUv;

#define pi 3.1415926535
#define PI2RAD .01745329252
#define TWO_PI (2. * PI)

void main() {
  vec2 uv = vUv;
  if (uv.y < .5) { //只显示一半的uv--半球
    discard;
  }
  uv += num;
  uv.y += time;
  float glowPower = .018;
  float glow = glowPower / mod(abs(uv.y - .5), 1.) - (glowPower / .5);
  gl_FragColor = vec4(max(vec3(glow - .4 + color), color) * color,
                      clamp(0., 1., glow * 1.) * opacity);
  gl_FragColor =
      mix(gl_FragColor, vec4(color, mix(.15, .4, 1. - (vUv.y - .5) / .5)), .35);
}