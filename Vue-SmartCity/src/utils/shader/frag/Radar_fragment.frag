uniform float time;
uniform vec3 color;
uniform float type;
varying vec2 vUv;
const float PI = 3.141592653589;
void main() {
  vec2 center = vec2(0.5);
  float dis = distance(vUv, center);
  vec2 direct = normalize(vec2(vUv.x - center.x, vUv.y - center.y));

  if (type == 0.0 || type == 1.0) {
    float step = fract(time);
    vec2 start = normalize(vec2(cos(2.0 * PI * step), sin(2.0 * PI * step)));
    float radius1 = 0.49;
    float radius2 = 0.0003; //中心圆环大小
    float alpha1 = smoothstep(1.0, 0.0, abs(dis - radius1) / 0.01);
    float alpha2 = smoothstep(1.0, 0.0, abs(dis - radius2) / 0.02);
    float alphastep;
    if (type == 0.0) {
      alphastep = smoothstep(0.0, 1.0, dot(direct, start));
    } else if (type == 1.0) {
      float diff = atan(0.0, 1.0) - atan(direct.y, direct.x);
      if (diff > 0.0) {
        alphastep = smoothstep(1.0, 0.0, diff / PI);
      } else {
        alphastep = smoothstep(0.03, 0.0, abs(diff) / PI);
      }
    }
    if (dis < radius1) {
      gl_FragColor =
          vec4(color, alphastep + (1.0 - alphastep) * alpha2 + alpha1);
    } else {
      gl_FragColor = vec4(color, alpha1 + alpha2);
    }
  } else if (type == 2.0) {
    float radius = 0.49;
    float alpha = 0.0;
    float step = fract(time);
    for (int i = 0; i < 5; i++) {
      vec2 start = normalize(vec2(cos(2.0 * PI * step), sin(2.0 * PI * step)));
      float alphax = smoothstep(0.5, 1.0, dot(direct, start));
      float alphay = smoothstep(1.0, 0.0, abs(dis - radius) / 0.01);
      if (alphax > 0.0 && alphay > 0.0) {
        // alpha += (alphax + alphay) * 0.5;
        alpha += (alphax * alphay);
      }
      radius -= 0.1;
      step -= 0.55;
    }
    step = fract(1.0 - time);
    radius = 0.44;
    for (int i = 0; i < 4; i++) {
      vec2 start = normalize(vec2(cos(2.0 * PI * step), sin(2.0 * PI * step)));
      float alphax = smoothstep(0.5, 1.0, dot(direct, start));
      float alphay = smoothstep(1.0, 0.0, abs(dis - radius) / 0.01);
      if (alphax > 0.0 && alphay > 0.0) {
        alpha += (alphax * alphay);
      }
      radius -= 0.1;
      step -= 0.55;
    }
    gl_FragColor = vec4(color, alpha);
  }
}