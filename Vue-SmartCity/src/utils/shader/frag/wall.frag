precision highp float;
precision highp int;
uniform vec3 baseColor;
uniform float Star_Swamp1456026805002_86_brightness;
uniform float time;
uniform float starRadius;
uniform vec3 starColor;
uniform float starDensity;
uniform float speed;
uniform vec2 resolution;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 color;
uniform float Cube_Edges1456095960812_41_brightness;
uniform float falloff;
varying vec2 Star_Swamp1456026805002_86_vUv;
varying vec3 Star_Swamp1456026805002_86_vPosition;
varying vec3 Star_Swamp1456026805002_86_vNormal;
float field(in vec3 p) {
  float strength = 7. + .03 * log(1.e-6 + fract(sin(time) * 4373.11));
  float accum = 0.;
  float prev = 0.;
  float tw = 0.;
  for (int i = 0; i < 32; ++i) {
    float mag = dot(p, p);
    p = abs(p) / mag + vec3(-.51, -.4, -1.3);
    float w = exp(-float(i) / 7.);
    accum += w * exp(-strength * pow(abs(mag - prev), 2.3));
    tw += w;
    prev = mag;
  }
  return max(0., 5. * accum / tw - .7);
}
vec3 nrand3(vec2 co) {
  vec3 a = fract(cos(co.x * 8.3e-3 + co.y) * vec3(1.3e5, 4.7e5, 2.9e5));
  vec3 b = fract(sin(co.x * 0.3e-3 + co.y) * vec3(8.1e5, 1.0e5, 0.1e5));
  vec3 c = mix(a, b, 0.5);
  return c;
}
varying vec2 Parallax_Starfield1456026810894_97_vUv;
float starrand(float seedx, float seedy, int seedp) {
  return 0.05 + 0.9 * fract(sin(float(seedp) * 437.234) * 374.2542 -
                            cos(seedx * 432.252) * 23.643 +
                            sin(seedy * 73.2454) * 372.23455);
}
varying vec3 Cube_Edges1456095960812_41_vPosition;
varying vec3 Cube_Edges1456095960812_41_vNormal;
varying vec2 Cube_Edges1456095960812_41_vUv;
varying vec2 Cube_Edges1456095960812_41_vUv2;
vec4 Star_Swamp1456026805002_86_main() {
  vec4 Star_Swamp1456026805002_86_gl_FragColor = vec4(0.0);
  vec2 uv = 1.0 * Star_Swamp1456026805002_86_vUv.xy - 1.0;
  vec2 uvs = uv;
  vec3 p = vec3(uvs / 4., 0) + vec3(2., -1.3, -1.);
  p += 0.15 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));
  vec3 p2 = vec3(uvs / (4. + sin(time * 0.11) * 0.2 + 0.2 +
                        sin(time * 0.15) * 0.3 + 0.4),
                 1.5) +
            vec3(2., -1.3, -1.);
  p2 += 0.15 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));
  vec3 p3 = vec3(uvs / (4. + sin(time * 0.14) * 0.23 + 0.23 +
                        sin(time * 0.19) * 0.31 + 0.31),
                 0.5) +
            vec3(2., -1.3, -1.);
  p3 += 0.15 * vec3(sin(time / 16.), sin(time / 12.), sin(time / 128.));
  float t = field(p);
  float t2 = field(p2);
  float t3 = field(p3);
  float v =
      (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
  vec3 c1 = mix(.8, 1., v) * vec3(1.8 * t * t * t, 1.4 * t * t, t);
  vec3 c2 = mix(.8, 1., v) * vec3(1.4 * t2 * t2 * t2, 1.8 * t2 * t2, t2);
  vec3 c3 = mix(.8, 1., v) * vec3(1.4 * t3 * t3 * t3, 1.8 * t3 * t3, t3);
  c1 *= baseColor;
  c2 *= baseColor;
  c3 *= baseColor;
  Star_Swamp1456026805002_86_gl_FragColor =
      vec4(Star_Swamp1456026805002_86_brightness *
               vec3(c1 * 0.7 + c2 * 0.5 + c3 * 0.3),
           1.0);
  return Star_Swamp1456026805002_86_gl_FragColor *= 0.9;
}
vec4 Parallax_Starfield1456026810894_97_main(void) {
  vec4 Parallax_Starfield1456026810894_97_gl_FragColor = vec4(0.0);
  vec2 position = Parallax_Starfield1456026810894_97_vUv.xy * resolution.xy;
  Parallax_Starfield1456026810894_97_gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  for (int p = 0; p < 20; p++) {
    float scale = (1.0 / starRadius) + float(p);
    vec2 vpos = position * scale;
    vpos.x += (time * speed) / scale;
    vpos.y += speed * time / scale;
    vec2 spos = vec2(starrand(floor(vpos.x), floor(vpos.y), p),
                     starrand(10.5 + floor(vpos.x), 10.5 + floor(vpos.y), p));
    float px = scale / 80.0 / 3.0;
    float size = 1.0 / (scale * (500.0 / starDensity));
    float brite = 1.0;
    if (size < px) {
      brite = size / px;
      size = px;
    }
    Parallax_Starfield1456026810894_97_gl_FragColor.rgb +=
        starColor *
        min(1.0, max(0.0, starDensity - length(spos - fract(vpos)) / size)) *
        brite;
  }
  return Parallax_Starfield1456026810894_97_gl_FragColor *= 1.0;
}
vec4 Cube_Edges1456095960812_41_main() {
  vec4 Cube_Edges1456095960812_41_gl_FragColor = vec4(0.0);
  vec2 multiplier =
      pow(abs(Cube_Edges1456095960812_41_vUv - 0.5), vec2(falloff));
  Cube_Edges1456095960812_41_gl_FragColor = vec4(
      color * Cube_Edges1456095960812_41_brightness * length(multiplier), 1.0);
  return Cube_Edges1456095960812_41_gl_FragColor *= 1.0;
}
void main() {
  gl_FragColor =
      (Parallax_Starfield1456026810894_97_main() +
       Star_Swamp1456026805002_86_main() + Cube_Edges1456095960812_41_main());
}
