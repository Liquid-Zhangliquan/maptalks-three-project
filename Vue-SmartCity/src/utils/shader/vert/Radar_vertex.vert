varying vec2 vUv;
uniform float type;
uniform float time;
const float PI = 3.141592653589;
void main() {
  vUv = uv;
  vec3 pos = position;
  if (type == 1.0) {
    float a = -time * 2.0 * PI;
    mat4 rMat = mat4(cos(a), -sin(a), 0.0, 0.0, sin(a), cos(a), 0.0, 0.0, 0.0,
                     0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * rMat * vec4(pos, 1.0);
  } else {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
}