precision highp float;
precision highp int;
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;
uniform float time;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
varying vec2 Star_Swamp1456026805002_86_vUv;
varying vec3 Star_Swamp1456026805002_86_vPosition;
varying vec3 Star_Swamp1456026805002_86_vNormal;
varying vec3 Parallax_Starfield1456026810894_97_vPosition;
varying vec3 Parallax_Starfield1456026810894_97_vNormal;
varying vec2 Parallax_Starfield1456026810894_97_vUv;
varying vec2 Parallax_Starfield1456026810894_97_vUv2;
varying vec3 Cube_Edges1456095960812_41_vPosition;
varying vec3 Cube_Edges1456095960812_41_vNormal;
varying vec2 Cube_Edges1456095960812_41_vUv;
varying vec2 Cube_Edges1456095960812_41_vUv2;
vec4 Star_Swamp1456026805002_86_main() {
  vec4 Star_Swamp1456026805002_86_gl_Position = vec4(0.0);
  Star_Swamp1456026805002_86_vUv = uv;
  Star_Swamp1456026805002_86_vPosition = position;
  Star_Swamp1456026805002_86_vNormal = normal;
  Star_Swamp1456026805002_86_gl_Position =
      projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  return Star_Swamp1456026805002_86_gl_Position *= 0.9;
}
vec4 Parallax_Starfield1456026810894_97_main() {
  vec4 Parallax_Starfield1456026810894_97_gl_Position = vec4(0.0);
  Parallax_Starfield1456026810894_97_vNormal = normal;
  Parallax_Starfield1456026810894_97_vUv = uv;
  Parallax_Starfield1456026810894_97_vUv2 = uv2;
  Parallax_Starfield1456026810894_97_vPosition = position;
  Parallax_Starfield1456026810894_97_gl_Position =
      projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  return Parallax_Starfield1456026810894_97_gl_Position *= 1.0;
}
vec4 Cube_Edges1456095960812_41_main() {
  vec4 Cube_Edges1456095960812_41_gl_Position = vec4(0.0);
  Cube_Edges1456095960812_41_vNormal = normal;
  Cube_Edges1456095960812_41_vUv = uv;
  Cube_Edges1456095960812_41_vUv2 = uv2;
  Cube_Edges1456095960812_41_vPosition = position;
  Cube_Edges1456095960812_41_gl_Position =
      projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  return Cube_Edges1456095960812_41_gl_Position *= 1.0;
}
void main() {
  gl_Position = Star_Swamp1456026805002_86_main() +
                Parallax_Starfield1456026810894_97_main() +
                Cube_Edges1456095960812_41_main();
}
