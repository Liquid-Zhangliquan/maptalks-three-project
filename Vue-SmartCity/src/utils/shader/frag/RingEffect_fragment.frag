uniform float time;
uniform vec3 color;
uniform float type;
uniform float num;
varying vec2 vUv;
void main() {
  float alpha = 1.0;
  float dis = distance(vUv, vec2(0.5)); // 0-0.5
  if (dis > 0.5) {
    discard;
  }
  if (type == 0.0) {
    float y = (sin(6.0 * num * (dis - time)) + 1.0) / 2.0;
    alpha = smoothstep(1.0, 0.0, abs(y - 0.5) / 0.5) * (0.5 - dis) * 2.;
  } else if (type == 1.0) {
    float step = fract(time * 4.) * 0.5;
    if (dis < step) {
      // alpha = smoothstep(1.0,0.0,abs(step-dis)/0.15);
      alpha = 1. - abs(step - dis) / 0.15;
    } else {
      alpha = smoothstep(1.0, 0.0, abs(step - dis) / 0.05);
    }
    alpha *= (pow((0.5 - dis) * 3.0, 2.0));
  }
  gl_FragColor = vec4(color, alpha);
}