const Qg = "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
const Gg =
        "\n  float rands(float p){\n    return fract(sin(p) * 10000.0);\n  }\n";
const ky =
        "\n  vec3 rands(vec3 c) {\n    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));\n    vec3 r;\n    r.z = fract(512.0*j);\n    j *= .125;\n    r.x = fract(512.0*j);\n    j *= .125;\n    r.y = fract(512.0*j);\n    return r-0.5;\n  }\n";
import * as THREE from "three";

export function getBreathWallMaterial(opts = {}) {
        let uniforms = {
                // time+=0.025
                time: {
                        type: "f",
                        value: 1,
                },
                color: {
                        type: "c",
                        value: new THREE.Color(opts.color || "#0099FF"),
                },
                opacity: {
                        type: "f",
                        value: opts.opacity || 0.7,
                },
        };
        let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
                .concat(
                        THREE.ShaderChunk.fog_pars_vertex,
                        "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                )
                .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
        // let Qg =
        //   "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
        let fragmentShaderSource = `
                  precision lowp float;
                  precision lowp int;
                  varying vec2 vUv;
                  uniform vec3 color;
                  uniform float time;
                  uniform float opacity;
                  void main() {
                    vec2 uv = vUv;
                    float scaleY = 0.7 + 0.3 * sin(time);
                    vec4 gradient = mix(vec4(color, opacity),
                      vec4(0., 0., 0., 0.0), min(1.0, uv.y / scaleY));
                    gl_FragColor = mix( mix(vec4(vec3(0.), 1), gradient, gradient.a), vec4(vec3(0.), 1), smoothstep(scaleY-0.00001, scaleY, uv.y));
                  }`;
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                defaultAttributeValues: {},
                vertexShader: vertexShaderSource,
                fragmentShader: fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                fog: !0,
        });

        // animate();
        function animate() {
                uniforms.time.value += 0.25;
                requestAnimationFrame(animate);
        }
        return meshMaterial;
};
// 环形墙
export function getRippleWall(opts = {}) {
        let uniforms = {
                // time+=0.025
                time: {
                        type: "f",
                        value: 0,
                },
                color: {
                        type: "c",
                        value: new THREE.Color(opts.color || "#0099FF"),
                },
                opacity: {
                        type: "f",
                        value: opts.opacity || 1,
                },
                num: {
                        type: "f",
                        value: opts.num || 5,
                },
                hiz: {
                        type: "f",
                        value: 0.3,
                },
        };
        let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
                .concat(
                        THREE.ShaderChunk.fog_pars_vertex,
                        "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                )
                .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
        // let Qg =
        //   "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
        let fragmentShaderSource = `
                  precision lowp float;
                  precision lowp int;
                  uniform float time;
                  uniform float opacity;
                  uniform vec3 color;
                  uniform float num;
                  uniform float hiz;
                  varying vec2 vUv;
                  void main() {
                    vec4 fragColor = vec4(0.);
                      float sin = sin((vUv.y - time * hiz) * 10. * num);
                      float high = 0.92;
                      float medium = 0.4;
                      if (sin > high) {
                        fragColor = vec4(mix(vec3(.8, 1., 1.), color, (1. - sin) / (1. - high)), 1.);
                      } else if(sin > medium) {
                        fragColor = vec4(color, mix(1., 0., 1.-(sin - medium) / (high - medium)));
                      } else {
                        fragColor = vec4(color, 0.);
                      }
                      vec3 fade = mix(color, vec3(0., 0., 0.), vUv.y);
                      fragColor = mix(fragColor, vec4(fade, 1.), 0.85);
                      gl_FragColor = vec4(fragColor.rgb, fragColor.a * opacity * (1. - vUv.y));
                  }`;
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                defaultAttributeValues: {},
                vertexShader: vertexShaderSource,
                fragmentShader: fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                fog: !0,
        });
        // animate();
        // export function animate() {
        //   uniforms.time.value += 0.025;
        //   requestAnimationFrame(animate);
        // }
        return meshMaterial;
};
//贴图围墙
export function getWallTextureMaterial(opts = {}) {
        let uniforms = {
                map: {
                        type: "t",
                        value: new THREE.TextureLoader().load(opts.image),
                },
                color: {
                        type: "c",
                        value: new THREE.Color(opts.color || "#9999FF"),
                },
                opacity: {
                        type: "f",
                        value: opts.opacity || 0.7,
                },
        };
        var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
                .concat(
                        THREE.ShaderChunk.fog_pars_vertex,
                        "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                )
                .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
        var fragmentShaderSource = `
                  precision lowp float;
                  precision lowp int;
                  uniform vec3 color;
                  uniform sampler2D map;
                  uniform float opacity;
                  varying vec2 vUv;
                  void main()
                  {
                    vec4 tex = texture2D(map, vUv);
                    gl_FragColor = vec4(tex.rgb * color, tex.a * opacity);
                  }`;
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                defaultAttributeValues: {},
                vertexShader: vertexShaderSource,
                fragmentShader: fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                // fog: !0
        });
        return meshMaterial;
};
// 扩散防护罩
export function getRippleShieldMaterial(opts = {}) {
        let uniforms = {
                time: {
                        // time+=0.006
                        type: "f",
                        value: 0,
                },
                color: {
                        type: "c",
                        value: new THREE.Color(opts.color || "#99CCFF"),
                },
                opacity: {
                        type: "f",
                        value: opts.opacity || 0.7,
                },
                num: {
                        type: "f",
                        value: opts.num || 1,
                },
        };
        let vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
                .concat(
                        THREE.ShaderChunk.fog_pars_vertex,
                        "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                )
                .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
        // let Qg =
        //   "\n  #define pi 3.1415926535\n  #define PI2RAD 0.01745329252\n  #define TWO_PI (2. * PI)\n";
        let fragmentShaderSource = `
                  precision lowp float;
                  precision lowp int;
                  uniform vec3 color;
                  uniform float opacity;
                  uniform float hiz;
                  uniform float num;
                  uniform float time;
                  varying vec2 vUv;
                  
                  #define pi 3.1415926535
                  #define PI2RAD 0.01745329252
                  #define TWO_PI (2. * PI)
          
                  void main() {
                    vec2 uv = vUv;
                    if (uv.y < 0.5) {//只显示一半的uv--半球
                      discard;
                    }
                    uv += num;
                    uv.y += time;
                    float glowPower = 0.018;
                    float glow = glowPower / mod(abs(uv.y - 0.5), 1.) - (glowPower / 0.5);
                    gl_FragColor = vec4(max(vec3(glow - 0.4 + color), color) * color, clamp(0.0, 1.0, glow * 1.) * opacity);
                    gl_FragColor = mix(gl_FragColor, vec4(color, mix(0.15, 0.4, 1. - (vUv.y - 0.5) / 0.5)), 0.35);
                  }`;
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: uniforms,
                defaultAttributeValues: {},
                vertexShader: vertexShaderSource,
                fragmentShader: fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                fog: !0,
        });
        return meshMaterial;
};
//防护罩
export function getElectricShieldMaterial(opts = {}) {
        var ElectricShield = {
                uniforms: {
                        time: {
                                // time+=0.012
                                type: "f",
                                value: 1,
                        },
                        color: {
                                type: "c",
                                value: new THREE.Color(opts.color || "#9999FF"),
                        },
                        opacity: {
                                type: "f",
                                value: opts.opacity || 1,
                        },
                },
                vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
                        .concat(
                                THREE.ShaderChunk.fog_pars_vertex,
                                "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
                fragmentShaderSource: `
                    #extension GL_OES_standard_derivatives : enable
                    uniform vec3 color;
                    uniform float opacity;
                    uniform float time;
                    varying vec2 vUv;
                    #define pi 3.1415926535
                    #define PI2RAD 0.01745329252
                    #define TWO_PI (2. * PI)
                    float rands(float p){
                      return fract(sin(p) * 10000.0);
                    }
                    float noise(vec2 p){
                      float t = time / 20000.0;
                      if(t > 1.0) t -= floor(t);
                      return rands(p.x * 14. + p.y * sin(t) * 0.5);
                    }
                    vec2 sw(vec2 p){
                      return vec2(floor(p.x), floor(p.y));
                    }
                    vec2 se(vec2 p){
                      return vec2(ceil(p.x), floor(p.y));
                    }
                    vec2 nw(vec2 p){
                      return vec2(floor(p.x), ceil(p.y));
                    }
                    vec2 ne(vec2 p){
                      return vec2(ceil(p.x), ceil(p.y));
                    }
                    float smoothNoise(vec2 p){
                      vec2 inter = smoothstep(0.0, 1.0, fract(p));
                      float s = mix(noise(sw(p)), noise(se(p)), inter.x);
                      float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
                      return mix(s, n, inter.y);
                    }
                    float fbm(vec2 p){
                      float z = 2.0;
                      float rz = 0.0;
                      vec2 bp = p;
                      for(float i = 1.0; i < 6.0; i++){
                        rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;
                        z *= 2.0;
                        p *= 2.0;
                      }
                      return rz;
                    }
                    void main() {
                      vec2 uv = vUv;
                      vec2 uv2 = vUv;
                      if (uv.y < 0.5) {
                        discard;
                      }
                      uv *= 4.;
                      float rz = fbm(uv);
                      uv /= exp(mod(time * 2.0, pi));
                      rz *= pow(15., 0.9);
                      gl_FragColor = mix(vec4(color, opacity) / rz, vec4(color, 0.1), 0.2);
                      if (uv2.x < 0.05) {
                        gl_FragColor = mix(vec4(color, 0.1), gl_FragColor, uv2.x / 0.05);
                      }
                      if (uv2.x > 0.95){
                        gl_FragColor = mix(gl_FragColor, vec4(color, 0.1), (uv2.x - 0.95) / 0.05);
                      }
                    }`,
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: ElectricShield.uniforms,
                defaultAttributeValues: {},
                vertexShader: ElectricShield.vertexShaderSource,
                fragmentShader: ElectricShield.fragmentShaderSource,
                // blending: THREE.NoBlending,
                // blending: THREE.AdditiveBlend ing,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !1,
                fog: !0,
        });
        return meshMaterial;
};
//警报效果
export function getAlarmShieldMaterial(opts = {}) {
        var AlarmShield = {
                uniforms: {
                        time: {
                                // time+=0.012
                                type: "f",
                                value: 1,
                        },
                        opacity: {
                                type: "f",
                                value: opts.opacity || 1,
                        },
                },
                vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
                        .concat(
                                THREE.ShaderChunk.fog_pars_vertex,
                                "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
                fragmentShaderSource: `
                    #extension GL_OES_standard_derivatives : enable
                    uniform float time;
                    uniform float opacity;
                    varying vec2 vUv;
                    void main(void)
                    {
                      float t=time*.1;
                      if (vUv.y < 0.5) {
                        discard;
                      }
                      vec2 uv = vec2(vUv.x - 0.25, vUv.y - 0.5);
                      
                      vec2 ouv=uv;
                      vec3 rd=normalize(vec3(uv,2.));
                      rd.xy*=mat2(cos(t),sin(t),-sin(t),cos(t));
                      vec3 ro=vec3(t+sin(t*6.53583)*.05,.01+sin(t*352.4855)*.0015,-t*3.);
                      vec3 p=ro;
                      float v=0., td=-mod(ro.z,.005);
                      for (int r=0; r<150; r++) {
                        v+=pow(max(0.,.01-length(abs(.01-mod(p,.02))))/.01,10.)*exp(-2.*pow((1.+td),2.));
                        p=ro+rd*td;
                        td+=.005;
                      }
                      gl_FragColor = vec4(v,v*v,v*v*v,0.)*8.*max(0.,1.-length(ouv*ouv)*2.5);
                      gl_FragColor.a = opacity;
                    }
                    `,
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: AlarmShield.uniforms,
                defaultAttributeValues: {},
                vertexShader: AlarmShield.vertexShaderSource,
                fragmentShader: AlarmShield.fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !1,
                fog: !0,
        });
        return meshMaterial;
};
//noise texture防护罩
export function getFbmShieldMaterial(opts = {}) {
        var FbmShield = {
                uniforms: {
                        time: {
                                type: "f",
                                value: 1,
                        },
                        color: {
                                type: "c",
                                value: new THREE.Color(opts.color || "#9999FF"),
                        },
                        opacity: {
                                type: "f",
                                value: opts.opacity || 1,
                        },
                        noise_map: {
                                type: "t",
                                value: opts.texture,
                        },
                },
                vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
                        .concat(
                                THREE.ShaderChunk.fog_pars_vertex,
                                "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
                fragmentShaderSource:
                        "\n  #extension GL_OES_standard_derivatives : enable\n\n  uniform float time;\n  uniform float opacity;\n  uniform vec3 color;\n  uniform sampler2D noise_map;\n  varying vec2 vUv;\n\n  #define tau 6.2831853\n\n  mat2 makem2(in float theta){float c = cos(theta);float s = sin(theta);return mat2(c,-s,s,c);}\n  float noise( in vec2 x ){return texture2D(noise_map, x*.01).x;}\n\n  float fbm(in vec2 p) {\n    float z=2.;\n    float rz = 0.;\n    vec2 bp = p;\n    for (float i= 1.;i < 6.;i++)\n    {\n      rz+= abs((noise(p)-0.5)*2.)/z;\n      z = z*2.;\n      p = p*2.;\n    }\n    return rz;\n  }\n\n  float dualfbm(in vec2 p) {\n      //get two rotated fbm calls and displace the domain\n    vec2 p2 = p*.7;\n    vec2 basis = vec2(fbm(p2-time*1.6),fbm(p2+time*1.7));\n    basis = (basis-.5)*.2;\n    p += basis;\n    \n    //coloring\n    return fbm(p*makem2(time*0.2));\n  }\n\n  float circ(vec2 p) {\n    float r = length(p);\n    //r = log(sqrt(r));\n      r = 0.5 * log(r);\n    return abs(mod(r*4.,tau)-3.14)*3.+.2;\n  }\n\n  void main(void) {\n    vec2 uv = vUv;\n    vec2 uv2 = vUv;\n    \n    if (uv.y < 0.5) {\n      discard;\n    }\n\n    uv.x = abs(uv.x - 0.5);\n    uv*=4.;\n    \n    float rz = dualfbm(uv);\n    rz *= 10.;\n    \n    //final color\n    vec3 col = color / rz;\n    col=pow(abs(col), vec3(.99));\n    \n    gl_FragColor = mix(vec4(col, opacity), vec4(vec3(0.), 0.1), 0.2);\n  }\n",
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: FbmShield.uniforms,
                defaultAttributeValues: {},
                vertexShader: FbmShield.vertexShaderSource,
                fragmentShader: FbmShield.fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !1,
                fog: !0,
        });
        return meshMaterial;
};
export function getElectricRippleShieldMaterial(opts = {}) {
        var Shield = {
                uniforms: {
                        time: {
                                type: "f",
                                value: 1,
                        },
                        color: {
                                type: "c",
                                value: new THREE.Color(opts.color || "#9999FF"),
                        },
                        opacity: {
                                type: "f",
                                value: opts.opacity || 1,
                        },
                        num: {
                                type: "f",
                                value: opts.num || 1,
                        },
                },
                vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
                        .concat(
                                THREE.ShaderChunk.fog_pars_vertex,
                                "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
                fragmentShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n\n  uniform vec3 color;\n  uniform float opacity;\n  uniform float time;\n  varying vec2 vUv;\n\n  ".concat(
                        ky,
                        "\n  \n  /* skew constants for 3d simplex functions */\n  const float F3 =  0.3333333;\n  const float G3 =  0.1666667;\n\n  /* 3d simplex noise */\n  float simplex3d(vec3 p) {\n    /* 1. find current tetrahedron T and it's four vertices */\n    /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */\n    /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/\n    \n    /* calculate s and x */\n    vec3 s = floor(p + dot(p, vec3(F3)));\n    vec3 x = p - s + dot(s, vec3(G3));\n    \n    /* calculate i1 and i2 */\n    vec3 e = step(vec3(0.0), x - x.yzx);\n    vec3 i1 = e*(1.0 - e.zxy);\n    vec3 i2 = 1.0 - e.zxy*(1.0 - e);\n      \n    /* x1, x2, x3 */\n    vec3 x1 = x - i1 + G3;\n    vec3 x2 = x - i2 + 2.0*G3;\n    vec3 x3 = x - 1.0 + 3.0*G3;\n    \n    /* 2. find four surflets and store them in d */\n    vec4 w, d;\n    \n    /* calculate surflet weights */\n    w.x = dot(x, x);\n    w.y = dot(x1, x1);\n    w.z = dot(x2, x2);\n    w.w = dot(x3, x3);\n    \n    /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */\n    w = max(0.6 - w, 0.0);\n    \n    /* calculate surflet components */\n    d.x = dot(rands(s), x);\n    d.y = dot(rands(s + i1), x1);\n    d.z = dot(rands(s + i2), x2);\n    d.w = dot(rands(s + 1.0), x3);\n    \n    /* multiply d by w^4 */\n    w *= w;\n    w *= w;\n    d *= w;\n    \n    /* 3. return the sum of the four surflets */\n    return dot(d, vec4(52.0));\n  }\n\n  float noise(vec3 m) {\n      return   0.5333333*simplex3d(m)\n        +0.2666667*simplex3d(2.0*m)\n        +0.1333333*simplex3d(4.0*m)\n        +0.0666667*simplex3d(8.0*m);\n  }\n\n  void main() {\n    vec2 uv = vUv;\n    uv.x = uv.x - 0.5;\n    if (vUv.y < 0.5) {\n      discard;\n    }\n    vec3 p3 = vec3(vUv, time*0.4);    \n      \n    float intensity = noise(vec3(p3*12.0+12.0));\n                            \n    float t = clamp((uv.x * -uv.x * 0.2) + 0.15, 0., 1.);                         \n    float y = fract(abs(intensity * -t + fract(uv.y) - fract(-time)));                  \n      \n    float g = pow(y, 0.15);\n    \n    vec3 col = vec3(2.);\n    col = col * -g + col;                    \n    col = col * col;\n    col = col * col;\n\n    gl_FragColor = vec4(col * color, opacity);\n  }\n"
                ),
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: Shield.uniforms,
                defaultAttributeValues: {},
                vertexShader: Shield.vertexShaderSource,
                fragmentShader: Shield.fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !1,
                fog: !0,
        });
        return meshMaterial;
};
export function getBuildTextureShaderMaterial(imgData, options) {
        var building_vertex = `
                  precision highp float;
                  precision highp int;
                  attribute vec2 maxUv;
                  varying vec2 vUv;
                  void main() {
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  }
                `;
        var building_fragment = `
                  #extension GL_OES_standard_derivatives : enable
                  precision highp float;
                  precision highp int;
                  uniform vec3 color;
                  uniform float opacity;
                  uniform sampler2D maps[1];
                  varying vec2 vUv;
                  void main(void){
                    vec2 uv = vUv;
                    gl_FragColor = texture2D(maps[0], uv);
                  }
                `;
        //vec4 tex = texture2D(maps[0], uv);
        // gl_FragColor = vec4(tex.rgb, tex.a * opacity);

        //gl_FragColor = texture2D(maps[0], uv);

        // building_fragment = `
        //   #extension GL_OES_standard_derivatives : enable
        //   precision highp float;
        //   precision highp int;
        //   uniform vec3 color;
        //   uniform float opacity;
        //   uniform sampler2D maps[1];
        //   varying vec2 vUv;
        //   void main(void){
        //     vec2 uv = vUv;
        //     if (uv.y < 0.1) {
        //       gl_FragColor = texture2D(maps[0], uv);
        //     } else if (uv.y < 0.2) {
        //       gl_FragColor = texture2D(maps[0], uv);
        //     } else if (uv.y < 0.5) {
        //       gl_FragColor = texture2D(maps[0], uv);
        //     }else
        //       gl_FragColor = texture2D(maps[0], uv);
        //   }
        // `;
        const texture = new THREE.TextureLoader().load(imgData);
        // texture.needsUpdate = true; //使用贴图时进行更新
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(0.002, 0.002);
        // texture.repeat.set(2, 2);
        return new THREE.ShaderMaterial({
                uniforms: {
                        opacity: {
                                type: "f",
                                value: options.opacity || 1,
                        },
                        color: {
                                type: "c",
                                value: new THREE.Color("#f00"),
                        },
                        maps: {
                                value: [texture],
                        },
                },
                vertexShader: building_vertex,
                fragmentShader: building_fragment,
                // polygonOffsetFactor: 0,
                // polygonOffsetUnits: 1,
                transparent: !1,
                // blending: THREE.AdditiveBlending,
                // blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
        });
};
//流星
export function getMeteorMaterial(opts = {}) {
        let uniforms = {
                time: {
                        //time+=0.0045
                        type: "f",
                        value: 0,
                },
                color: {
                        type: "c",
                        value: new THREE.Color(opts.color || "#EDD464"),
                },
                opacity: {
                        type: "f",
                        value: opts.opacity || 0.9,
                },
        };
        var vertexShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  "
                .concat(
                        THREE.ShaderChunk.fog_pars_vertex,
                        "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
                )
                .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
        var fragmentShaderSource = "\n  precision lowp float;\n  precision lowp int;\n  uniform float time;\n  uniform vec3 color;\n  uniform float opacity;\n\n  varying vec2 vUv;\n\n  ".concat(
                Qg,
                "\n\n  float nutsack(vec2 uv){\n    uv.x *= sin(1.)*2.;\n    float t =  time*0.4;\n    uv.x = uv.x*180.0;\n    float dx = fract(uv.x);\n    uv.x = floor(uv.x);\n    uv.y *= 0.15;\n    float o=sin(uv.x*215.4);\n    float s=cos(uv.x*33.1)*.3 +.7;\n    float trail = mix(95.0,15.0,s);\n    float yv = 1.0/(fract(1. - uv.y + t*s + o) * trail);\n    yv = smoothstep(0.0,1.0,yv*yv);\n    yv = sin(yv*pi)*(s*5.0);\n    float d = sin(dx*pi);\n    return yv*(d*d);\n  }\n\n  void main() {\n    vec3 col = color * nutsack(vUv); // Get the jizz flowing\n    col += mix(color, vec3(0.,0.,0.), vUv.y);\n    gl_FragColor=vec4(col, opacity * (1. - vUv.y)); // output the spunk\n  }\n"
        );
        let material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                defaultAttributeValues: {},
                vertexShader: vertexShaderSource,
                fragmentShader: fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !1,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                fog: !0,
        });

        // animate();
        // export function animate() {
        //   uniforms.time.value += options.dua || 0.045;
        //   requestAnimationFrame(animate);
        // }
        return material;
};
//扩散圆环
export function getRingEffectMaterial(color, type) {
        var ringShield = {
                //扩散圆环
                uniforms: {
                        color: {
                                type: "c",
                                value: new THREE.Color(color || "#9999FF"),
                        },
                        time: {
                                type: "f",
                                value: -1.5,
                        },
                        type: {
                                type: "f",
                                value: type || 0,
                        },
                        num: {
                                type: "f",
                                value: 4,
                        },
                },
                vertexShaderSource: `
                      varying vec2 vUv;
                      void main(){
                              vUv = uv;
                              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                      }`,
                fragmentShaderSource: `
                      uniform float time;
                      uniform vec3 color;
                      uniform float type;
                      uniform float num;
                      varying vec2 vUv;\n
                      void main(){
                          float alpha = 1.0;
                          float dis = distance(vUv,vec2(0.5));//0-0.5
                          if(dis > 0.5){
                              discard;
                          }
                          if(type ==0.0){
                                  float y = (sin(6.0 * num *(dis-time)) + 1.0)/2.0;
                              alpha = smoothstep(1.0,0.0,abs(y-0.5)/0.5) * (0.5 -dis) * 2.;
                          }else if(type ==1.0){
                                  float step = fract(time* 4.)* 0.5;
                              if(dis<step){
                                      // alpha = smoothstep(1.0,0.0,abs(step-dis)/0.15);
                                  alpha =1.- abs(step-dis)/0.15;
                              }else{
                                      alpha = smoothstep(1.0,0.0,abs(step-dis)/0.05);
                              }
                              alpha *= (pow((0.5 -dis)* 3.0,2.0));
                          }
                          gl_FragColor = vec4(color,alpha );
                      }`,
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: ringShield.uniforms,
                defaultAttributeValues: {},
                vertexShader: ringShield.vertexShaderSource,
                fragmentShader: ringShield.fragmentShaderSource,
                // blending: THREE.NoBlending,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !0,
                fog: !0,
        });
        // animate();
        // export function animate() {
        //   ringShield.uniforms.time.value += speed || 0.005;
        //   requestAnimationFrame(animate);
        // }
        return meshMaterial;
};
//雷达
export function getRandarMetarial(opts = {}) {
        var randarShield = {
                //雷达
                uniforms: {
                        time: {
                                type: "f",
                                value: 0,
                        },
                        type: {
                                type: "f",
                                value: opts.type || 1, // 0 大扇形 1小扇形 2 环绕
                        },
                        color: {
                                type: "c",
                                value: new THREE.Color(opts.color || 0x00ffff),
                        },
                },
                vertexShaderSource: `
                      varying vec2 vUv;
                      uniform float type;
                      uniform float time;
                      const float PI = 3.141592653589;
                      void main(){
                          vUv = uv;
                          vec3 pos = position;
                          if(type==1.0){
                              float a = -time * 2.0 * PI;
                              mat4 rMat= mat4(
                                  cos(a), -sin(a), 0.0,0.0,
                                  sin(a), cos(a), 0.0,0.0,
                                  0.0, 0.0, 1.0,0.0,
                                  0.0, 0.0, 0.0,1.0
                              );
                              gl_Position = projectionMatrix * modelViewMatrix * rMat * vec4(pos, 1.0);
                          }else{
                                  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                          }
                      }`,
                fragmentShaderSource: `
                      uniform float time;
                      uniform vec3 color;
                      uniform float type;
                      varying vec2 vUv;
                      const float PI = 3.141592653589;
                      void main(){
                          vec2 center = vec2(0.5);
                          float dis = distance(vUv,center);
                          vec2 direct = normalize(vec2(vUv.x - center.x,vUv.y - center.y));
          
                          if(type==0.0||type==1.0){
                              float step = fract(time);
                              vec2 start = normalize(vec2(cos(2.0 * PI * step),sin(2.0 * PI * step)));
                              float radius1 = 0.49;
                              float radius2 = 0.0003;//中心圆环大小
                              float alpha1 = smoothstep(1.0,0.0,abs(dis-radius1)/0.01);
                              float alpha2 = smoothstep(1.0,0.0,abs(dis-radius2)/0.02);
                              float alphastep;
                              if(type==0.0){
                                  alphastep = smoothstep(0.0,1.0,dot(direct,start));
                          }else if(type==1.0){
                                  float diff = atan(0.0,1.0) - atan(direct.y,direct.x);
                                  if(diff > 0.0){
                                      alphastep = smoothstep(1.0,0.0,diff/PI);
                              }else{
                                      alphastep = smoothstep(0.03,0.0,abs(diff)/PI);
                              }
                          }
                          if(dis<radius1){
                                  gl_FragColor =  vec4(color,alphastep + (1.0 - alphastep) *alpha2 + alpha1);
                          }else{
                                  gl_FragColor =  vec4(color,alpha1 + alpha2);
                          }
                          }else if(type==2.0){
                                  float radius = 0.49;
                                  float alpha = 0.0;
                                  float step = fract(time);
                                  for(int i =0;i<5;i++){
                                      vec2 start = normalize(vec2(cos(2.0 * PI * step),sin(2.0 * PI * step)));
                                      float alphax = smoothstep(0.5,1.0,dot(direct,start));
                                      float alphay = smoothstep(1.0,0.0,abs(dis-radius)/0.01);
                                      if(alphax >0.0 && alphay >0.0){
                                          // alpha += (alphax + alphay) * 0.5;
                                          alpha += (alphax * alphay) ;
                                  }
                                  radius -= 0.1;
                                  step -=0.55;
                              }
                              step = fract(1.0 - time);
                              radius = 0.44;
                              for(int i =0;i<4;i++){
                                      vec2 start = normalize(vec2(cos(2.0 * PI * step),sin(2.0 * PI * step)));
                                  float alphax = smoothstep(0.5,1.0,dot(direct,start));
                                  float alphay = smoothstep(1.0,0.0,abs(dis-radius)/0.01);
                                  if(alphax >0.0 && alphay >0.0){
                                          alpha += (alphax * alphay) ;
                                  }
                                  radius -= 0.1;
                                  step -=0.55;
                              }
                              gl_FragColor =  vec4(color,alpha);
                          }
          
                      }`,
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: randarShield.uniforms,
                defaultAttributeValues: {},
                vertexShader: randarShield.vertexShaderSource,
                fragmentShader: randarShield.fragmentShaderSource,
                // blending: THREE.NoBlending,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !1,
                fog: !0,
        });
        // animate();
        // export function animate() {
        //   randarShield.uniforms.time.value += 0.015;
        //   requestAnimationFrame(animate);
        // }
        return meshMaterial;
};
//雷达扫描
export function FlabellumScanMaterial(opts = {}) {
        //new THREE.PlaneBufferGeometry(this.radius,this.radius,2)
        var ScanShield = {
                //雷达
                uniforms: {
                        time: {
                                type: "f",
                                value: 0,
                        },
                        color: {
                                type: "c",
                                value: new THREE.Color(opts.color || "#ff0000"),
                        },
                        opacity: {
                                type: "f",
                                value: opts.color || 1,
                        },
                },
                vertexShaderSource: `
                    varying vec2 vUv;
                    void main(){
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`,
                fragmentShaderSource: `
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
                      float t = atan(pos.y, pos.x) - time*2.5;
                      float a = (atan(sin(t), cos(t)) + pi)/(2.0*pi);
                      float ta = 0.5;
                      float v = smoothstep(ta-0.05,ta+0.05,a) * smoothstep(ta+0.05,ta-0.05,a);
                      vec3 col = vec3(0, v, 0);
                      float blink = pow(sin(time*1.5)*0.5+0.5, 0.8);
                      gl_FragColor = vec4(color, opacity * pow(a, 8.0*(.2+blink))*(sin(r*300.0)*.5+.5)*pow(r, 0.4));
                    }
                  `,
        };
        let material = new THREE.ShaderMaterial({
                uniforms: ScanShield.uniforms,
                vertexShader: ScanShield.vertexShaderSource,
                fragmentShader: ScanShield.fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
        });
        animate();
        function animate() {
                ScanShield.uniforms.time.value += opts.speed || 0.015;
                requestAnimationFrame(animate);
        }
        return material;
};
//bloom??
export function getGlowMaterial(color) {
        let glowShield = {
                //glow发光效果
                uniforms: {
                        s: { type: "f", value: -1.0 },
                        b: { type: "f", value: 1.0 },
                        p: { type: "f", value: 2.0 },
                        glowColor: { type: "c", value: new THREE.Color(color || 0xdb633f) },
                },
                vertexShaderSource: `
                      varying vec3 vNormal;
                      varying vec3 vPositionNormal;
                      void main()
                      {
                          vNormal = normalize( normalMatrix * normal ); // 转换到视图空间
                          vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
                          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                      }
                `,
                fragmentShaderSource: `
                      uniform vec3 glowColor;
                      uniform float b;
                      uniform float p;
                      uniform float s;
                      varying vec3 vNormal;
                      varying vec3 vPositionNormal;
                      void main()
                      {
                          float a = pow( b + s * abs(dot(vNormal, vPositionNormal)), p );
                          gl_FragColor = vec4( glowColor, a );
                      }
                `,
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: glowShield.uniforms,
                defaultAttributeValues: {},
                vertexShader: glowShield.vertexShaderSource,
                fragmentShader: glowShield.fragmentShaderSource,
                // blending: THREE.NoBlending,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !1,
                fog: !0,
        });
        return meshMaterial;
};
//结合arcline使用
export function getLightningLineMaterial(opts = {}) {
        var LightningLineShield = {
                uniforms: THREE.UniformsUtils.merge([
                        THREE.UniformsLib.fog,
                        {
                                map: {
                                        type: "t",
                                        value: null,
                                },
                                useMap: {
                                        type: "f",
                                        value: 0,
                                },
                                alphaMap: {
                                        type: "f",
                                        value: null,
                                },
                                useAlphaMap: {
                                        type: "f",
                                        value: 0,
                                },
                                resolution: {
                                        type: "v2",
                                        value: new THREE.Vector2(1920, 1808),
                                        //   value: new THREE.Vector2(
                                        //     this.viewer.box.clientWidth,
                                        //     this.viewer.box.clientHeight
                                        //   )
                                },
                                sizeAttenuation: {
                                        type: "f",
                                        value: 0,
                                },
                                near: {
                                        type: "f",
                                        value: 1,
                                },
                                far: {
                                        type: "f",
                                        value: 1,
                                },
                                dashArray: {
                                        type: "f",
                                        value: 0,
                                },
                                dashOffset: {
                                        type: "f",
                                        value: 0,
                                },
                                dashRatio: {
                                        type: "f",
                                        value: 0.5,
                                },
                                useDash: {
                                        type: "f",
                                        value: 0,
                                },
                                visibility: {
                                        type: "f",
                                        value: 1,
                                },
                                alphaTest: {
                                        type: "f",
                                        value: 0,
                                },
                                lineWidth: {
                                        type: "f",
                                        value: opts.lineWidth || 4,
                                },
                                color: {
                                        type: "c",
                                        value: new THREE.Color(opts.color || "#9999FF"),
                                },
                                opacity: {
                                        type: "f",
                                        value: opts.opacity || 1,
                                },
                                time: {
                                        type: "f",
                                        value: 0,
                                },
                        },
                ]),
                vertexShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  "
                        .concat(THREE.ShaderChunk.logdepthbuf_pars_vertex, "\n  ")
                        .concat(
                                THREE.ShaderChunk.fog_pars_vertex,
                                "\n  attribute vec3 position;\n  attribute vec3 previous;\n  attribute vec3 next;\n  attribute float side;\n  attribute float width;\n  attribute vec2 uv;\n  attribute float counters;\n\n  uniform mat4 projectionMatrix;\n  uniform mat4 modelViewMatrix;\n  uniform vec2 resolution;\n  uniform float lineWidth;\n  uniform float near;\n  uniform float far;\n  uniform float sizeAttenuation;\n\n  varying vec2 vUv;\n  // varying float vCounters;\n\n  vec2 fix( vec4 i, float aspect ) {\n    vec2 res = i.xy / i.w;\n    res.x *= aspect;\n    // vCounters = counters;\n    return res;\n  }\n  void main() {\n    float aspect = resolution.x / resolution.y;\n    float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);\n    vUv = uv;\n\n    mat4 m = projectionMatrix * modelViewMatrix;\n    vec4 finalPosition = m * vec4( position, 1.0 );\n    vec4 prevPos = m * vec4( previous, 1.0 );\n    vec4 nextPos = m * vec4( next, 1.0 );\n\n    vec2 currentP = fix( finalPosition, aspect );\n    vec2 prevP = fix( prevPos, aspect );\n    vec2 nextP = fix( nextPos, aspect );\n\n    float pixelWidth = finalPosition.w * pixelWidthRatio;\n    float w = 1.8 * pixelWidth * lineWidth * width;\n\n    if( sizeAttenuation == 1. ) {\n      w = 1.8 * lineWidth * width;\n    }\n\n    vec2 dir;\n    if( nextP == currentP ) dir = normalize( currentP - prevP );\n    else if( prevP == currentP ) dir = normalize( nextP - currentP );\n    else {\n      vec2 dir1 = normalize( currentP - prevP );\n      vec2 dir2 = normalize( nextP - currentP );\n      dir = normalize( dir1 + dir2 );\n\n      vec2 perp = vec2( -dir1.y, dir1.x );\n      vec2 miter = vec2( -dir.y, dir.x );\n      //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );\n    }\n\n    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;\n    vec2 normal = vec2( -dir.y, dir.x );\n    normal.x /= aspect;\n    normal *= .5 * w;\n\n    vec4 offset = vec4( normal * side, 0.0, 1.0 );\n    finalPosition.xy += offset.xy;\n\n    gl_Position = finalPosition;\n    "
                        )
                        .concat(
                                THREE.ShaderChunk.logdepthbuf_vertex,
                                "\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
                fragmentShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  uniform float time;\n  uniform vec2 resolution;\n  uniform vec3 color;\n  uniform float opacity;\n  "
                        .concat(THREE.ShaderChunk.common, "\n  ")
                        .concat(
                                THREE.ShaderChunk.fog_pars_fragment,
                                "\n  varying vec2 vUv;\n\n  "
                        )
                        .concat(
                                ky,
                                "\n  /* skew constants for 3d simplex functions */\n  const float F3 =  0.3333333;\n  const float G3 =  0.1666667;\n\n  /* 3d simplex noise */\n  float simplex3d(vec3 p) {\n    /* 1. find current tetrahedron T and it's four vertices */\n    /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */\n    /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/\n\n    /* calculate s and x */\n    vec3 s = floor(p + dot(p, vec3(F3)));\n    vec3 x = p - s + dot(s, vec3(G3));\n\n    /* calculate i1 and i2 */\n    vec3 e = step(vec3(0.0), x - x.yzx);\n    vec3 i1 = e*(1.0 - e.zxy);\n    vec3 i2 = 1.0 - e.zxy*(1.0 - e);\n\n    /* x1, x2, x3 */\n    vec3 x1 = x - i1 + G3;\n    vec3 x2 = x - i2 + 2.0*G3;\n    vec3 x3 = x - 1.0 + 3.0*G3;\n\n    /* 2. find four surflets and store them in d */\n    vec4 w, d;\n\n    /* calculate surflet weights */\n    w.x = dot(x, x);\n    w.y = dot(x1, x1);\n    w.z = dot(x2, x2);\n    w.w = dot(x3, x3);\n\n    /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */\n    w = max(0.6 - w, 0.0);\n\n    /* calculate surflet components */\n    d.x = dot(rands(s), x);\n    d.y = dot(rands(s + i1), x1);\n    d.z = dot(rands(s + i2), x2);\n    d.w = dot(rands(s + 1.0), x3);\n\n    /* multiply d by w^4 */\n    w *= w;\n    w *= w;\n    d *= w;\n\n    /* 3. return the sum of the four surflets */\n    return dot(d, vec4(52.0));\n  }\n\n  float noise(vec3 m) {\n      return   0.5333333*simplex3d(m)\n        +0.2666667*simplex3d(2.0*m)\n        +0.1333333*simplex3d(4.0*m)\n        +0.0666667*simplex3d(8.0*m);\n  }\n  void main(){\n    vec2 uv = vUv - 0.5;\n    vec2 p = gl_FragCoord.xy/resolution.x;\n    vec3 p3 = vec3(p, time*0.4);\n\n    float intensity = noise(vec3(p3*12.0+12.0));\n\n    float t = clamp((uv.x * -uv.x * 0.16) + 0.15, 0., 1.);\n    float y = abs(intensity * -t + uv.y * 0.5);\n\n    float g = pow(y, 0.2);\n\n    // vec3 col = vec3(1.70, 1.48, 1.78);\n    vec3 col = vec3(1.) * 1.7;\n    col = col * -g + col;\n    col = col * col;\n    col = col * col;\n\n    gl_FragColor = vec4(col * color, opacity);\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n"),
        };
        var r = new THREE.RawShaderMaterial({
                uniforms: LightningLineShield.uniforms,
                vertexShader: LightningLineShield.vertexShaderSource,
                fragmentShader: LightningLineShield.fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                fog: !0,
                defines: {
                        USE_FOG: !0,
                },
        });
        // animate();
        // export function animate() {
        //   LightningLineShield.uniforms.time.value += 0.15;
        //   requestAnimationFrame(animate);
        // }
        return r;
};
export function getflowTrailLineMaterial(opts = {}) {
        var LightningLineShield = {
                uniforms: THREE.UniformsUtils.merge([
                        THREE.UniformsLib.fog,
                        {
                                map: {
                                        type: "t",
                                        value: null,
                                },
                                useMap: {
                                        type: "f",
                                        value: 0,
                                },
                                alphaMap: {
                                        type: "f",
                                        value: null,
                                },
                                useAlphaMap: {
                                        type: "f",
                                        value: 0,
                                },
                                resolution: {
                                        type: "v2",
                                        value: new THREE.Vector2(1920, 1808),
                                        //   value: new THREE.Vector2(
                                        //     this.viewer.box.clientWidth,
                                        //     this.viewer.box.clientHeight
                                        //   )
                                },
                                sizeAttenuation: {
                                        type: "f",
                                        value: 0,
                                },
                                near: {
                                        type: "f",
                                        value: 1,
                                },
                                far: {
                                        type: "f",
                                        value: 1,
                                },
                                dashArray: {
                                        type: "f",
                                        value: 0,
                                },
                                dashOffset: {
                                        type: "f",
                                        value: 0,
                                },
                                dashRatio: {
                                        type: "f",
                                        value: 0.5,
                                },
                                useDash: {
                                        type: "f",
                                        value: 0,
                                },
                                visibility: {
                                        type: "f",
                                        value: 1,
                                },
                                alphaTest: {
                                        type: "f",
                                        value: 0,
                                },
                                lineWidth: {
                                        type: "f",
                                        value: opts.lineWidth || 4,
                                },
                                color: {
                                        type: "c",
                                        value: new THREE.Color(opts.color || "#9999FF"),
                                },
                                opacity: {
                                        type: "f",
                                        value: opts.opacity || 1,
                                },
                                time: {
                                        type: "f",
                                        value: 0,
                                },
                        },
                ]),
                vertexShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  "
                        .concat(THREE.ShaderChunk.logdepthbuf_pars_vertex, "\n  ")
                        .concat(
                                THREE.ShaderChunk.fog_pars_vertex,
                                "\n  attribute vec3 position;\n  attribute vec3 previous;\n  attribute vec3 next;\n  attribute float side;\n  attribute float width;\n  attribute vec2 uv;\n  attribute float counters;\n\n  uniform mat4 projectionMatrix;\n  uniform mat4 modelViewMatrix;\n  uniform vec2 resolution;\n  uniform float lineWidth;\n  uniform float near;\n  uniform float far;\n  uniform float sizeAttenuation;\n\n  varying vec2 vUv;\n  // varying float vCounters;\n\n  vec2 fix( vec4 i, float aspect ) {\n    vec2 res = i.xy / i.w;\n    res.x *= aspect;\n    // vCounters = counters;\n    return res;\n  }\n  void main() {\n    float aspect = resolution.x / resolution.y;\n    float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);\n    vUv = uv;\n\n    mat4 m = projectionMatrix * modelViewMatrix;\n    vec4 finalPosition = m * vec4( position, 1.0 );\n    vec4 prevPos = m * vec4( previous, 1.0 );\n    vec4 nextPos = m * vec4( next, 1.0 );\n\n    vec2 currentP = fix( finalPosition, aspect );\n    vec2 prevP = fix( prevPos, aspect );\n    vec2 nextP = fix( nextPos, aspect );\n\n    float pixelWidth = finalPosition.w * pixelWidthRatio;\n    float w = 1.8 * pixelWidth * lineWidth * width;\n\n    if( sizeAttenuation == 1. ) {\n      w = 1.8 * lineWidth * width;\n    }\n\n    vec2 dir;\n    if( nextP == currentP ) dir = normalize( currentP - prevP );\n    else if( prevP == currentP ) dir = normalize( nextP - currentP );\n    else {\n      vec2 dir1 = normalize( currentP - prevP );\n      vec2 dir2 = normalize( nextP - currentP );\n      dir = normalize( dir1 + dir2 );\n\n      vec2 perp = vec2( -dir1.y, dir1.x );\n      vec2 miter = vec2( -dir.y, dir.x );\n      //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );\n    }\n\n    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;\n    vec2 normal = vec2( -dir.y, dir.x );\n    normal.x /= aspect;\n    normal *= .5 * w;\n\n    vec4 offset = vec4( normal * side, 0.0, 1.0 );\n    finalPosition.xy += offset.xy;\n\n    gl_Position = finalPosition;\n    "
                        )
                        .concat(
                                THREE.ShaderChunk.logdepthbuf_vertex,
                                "\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
                fragmentShaderSource: "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  uniform float visibility;\n  uniform vec3 color;\n  uniform vec3 color_end;\n  uniform float lineWidth;\n  uniform float time;\n  uniform float trail_opacity;\n  uniform float num;\n  uniform float percent;\n\n  "
                        .concat(THREE.ShaderChunk.common, "\n  ")
                        .concat(
                                THREE.ShaderChunk.fog_pars_fragment,
                                "\n\n  varying vec2 vUv;\n  // varying float vCounters;\n\n  void main() {\n    vec2 uv = vUv;\n    vec2 uv2 = uv;\n    uv.x *= num;\n    uv.x = mod(uv.x - time, 1.);\n    uv.x = uv.x * percent - (percent - 1.);\n\n    float trailOpacity = trail_opacity;\n    gl_FragColor = vec4(mix(color, color_end, uv2.x), trailOpacity);\n    if (uv.x > trailOpacity) {\n      gl_FragColor = vec4(mix(vec3(1., 1., 1.), gl_FragColor.rgb, 1.-uv.x), uv.x);\n    }\n\n    // gl_FragColor.a *= step(vCounters, visibility);\n    "
                        )
                        .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n"),
        };
        var r = new THREE.RawShaderMaterial({
                uniforms: LightningLineShield.uniforms,
                vertexShader: LightningLineShield.vertexShaderSource,
                fragmentShader: LightningLineShield.fragmentShaderSource,
                blending: THREE.AdditiveBlending,
                transparent: !0,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                fog: !0,
                defines: {
                        USE_FOG: !0,
                },
        });
        return r;
};
export function getLightBeamMaterial() {
        let shield = {
                //
                uniforms: {
                        time: {
                                type: "f",
                                value: 0,
                        },
                        type: {
                                type: "f",
                                value: 2,
                        },
                        dir: {
                                type: "f",
                                value: 2,
                        },
                        color: {
                                type: "c",
                                value: new THREE.Color(9055202),
                        },
                        map: {
                                type: "t",
                                value: null,
                        },
                },
                vertexShaderSource: `
                uniform float time;
                uniform float type;
                varying vec2 vUv;
                varying float progress;\n
                void main(){
                      vUv = uv;
                      vec3 pos = position;
                      if(type==4.0){
                          progress = mod(time,20.0)/20.;
                          pos.xz *= (progress + 0.2);
                    }
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }`,
                fragmentShaderSource: `
                uniform float time;
                uniform vec3 color;
                uniform float type;
                uniform float dir;
                uniform sampler2D map;
                varying vec2 vUv;
                varying float progress;\n\n
                float random (in vec2 _st) {
                      return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
                }
                float noise (vec2 _st) {
                      vec2 i = floor(_st);
                      vec2 f = fract(_st);
                      float a = random(i);
                      float b = random(i + vec2(1.0, 0.0));
                      float c = random(i + vec2(0.0, 1.0));
                      float d = random(i + vec2(1.0, 1.0));
                      vec2 u = f * f * (3.0 - 2.0 * f);
                      return mix(a, b, u.x) +
                              (c - a)* u.y * (1.0 - u.x) +
                              (d - b) * u.x * u.y;
                }
                vec2 hash22( vec2 p ){
                      p = vec2( dot(p,vec2(127.1,311.7)),
                              dot(p,vec2(269.5,183.3)) );
                      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
                }
                float hash21(vec2 p){
                      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                      //vec3 p3  = fract(vec3(p.xyx) * .1931);
                      //p3 += dot(p3, p3.yzx + 19.19);
                      //return fract((p3.x + p3.y) * p3.z);
                }
                float perlinNoise(vec2 p) {
                      vec2 pi = floor(p);
                    vec2 pf = fract(p);
                    vec2 w = pf * pf * (3.0 - 2.0 * pf);
                    return mix(mix(dot(hash22(pi + vec2(0.0, 0.0)), pf - vec2(0.0, 0.0)),
                                   dot(hash22(pi + vec2(1.0, 0.0)), pf - vec2(1.0, 0.0)), w.x),
                               mix(dot(hash22(pi + vec2(0.0, 1.0)), pf - vec2(0.0, 1.0)),
                                   dot(hash22(pi + vec2(1.0, 1.0)), pf - vec2(1.0, 1.0)), w.x),
                               w.y);
              }
                #define NUM_OCTAVES 15
                float fbm (vec2 _st) {
                      float v = 0.0;
                    float a = 0.5;
                    vec2 shift = vec2(100.0);
                    mat2 rot = mat2(cos(0.5), sin(0.5),
                                    -sin(0.5), cos(0.50));
                    for (int i = 0; i < NUM_OCTAVES; ++i) {
                          v += a * noise(_st);
                        _st = rot * _st * 2.0 + shift;
                        a *= 0.5;
                  }
                    return v;
              }
          
          
                #define OCTAVES1 15
                float fbm1 (in vec2 st) {
                      float value = 0.0;
                    float amplitude = .5;
                    float frequency = 0.;
                    for (int i = 0; i < OCTAVES1; i++) {
                          value += amplitude * noise(st);
                        st *= 2.;
                        amplitude *= .5;
                  }
                    return value;
              }\n
                const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );
                float fbm6( vec2 p ) {
                      float f = 0.0;
                    f += 0.500000*perlinNoise( p ); p = mtx*p*2.02;
                    f += 0.250000*perlinNoise( p ); p = mtx*p*2.03;
                    f += 0.125000*perlinNoise( p ); p = mtx*p*2.01;
                    f += 0.062500*perlinNoise( p ); p = mtx*p*2.04;
                    f += 0.031250*perlinNoise( p ); p = mtx*p*2.01;
                    f += 0.015625*perlinNoise( p );
                    return f/0.96875;
              }\n\n
                void main(){
                      if(type ==0.0){
                          float alpha;
                        if(dir==0.0){
                              alpha = smoothstep(0.0,1.0,vUv.y + sin(time)* 0.1);
                      }else if(dir==1.0){
                              alpha = smoothstep(1.0,0.0,vUv.y + sin(time)* 0.1);
                      }else if(dir==2.0){
                              alpha = smoothstep(0.7,0.05,(abs(vUv.y-0.5)+sin(time)* 0.1)/0.6);
                      }else{
                              alpha = smoothstep(0.0,1.0,vUv.y + sin(time)* 0.1);
                      }
                        gl_FragColor =  vec4(color,alpha);
                  }else if(type==1.0){
                          vec2 st = vUv ;
                        float alpha;
                        st += st * abs(fract(time) *0.01);
                        vec3 color = vec3(color);
                        if(dir==0.0){
                              alpha = smoothstep(0.0,1.0,vUv.y);
                      }else if(dir==1.0){
                              alpha = smoothstep(1.0,0.0,vUv.y);
                      }else if(dir==2.0){
                              alpha = smoothstep(0.9,0.05,abs(vUv.y - 0.5)/0.5);
                      }else{
                              alpha = smoothstep(0.0,1.0,vUv.y);
                      }\n
                        vec2 q = vec2(0.);
                        q.x = fbm( st + 0.05*time);
                        q.y = fbm( st + vec2(1.0));
                        vec2 r = vec2(0.);
                        r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time * 0.3 );
                        r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time * 0.3);
                        float f = fbm(st+r);
                        gl_FragColor = vec4((f*f*f + .6*f*f + .5*f)*color,alpha);\n\n
                        // st = vec2((st.x +time/10.)/2.0,st.y);
                        // color += fbm6(st*3.0);
                        // gl_FragColor = vec4(color,alpha);
                  }else if(type==2.0){
                          vec3 color = vec3(color);
                        float alpha;
                        if(dir==0.0){
                              alpha = smoothstep(0.0,1.0,vUv.y);
                      }else if(dir==1.0){
                              alpha = smoothstep(1.0,0.0,vUv.y);
                      }else if(dir==2.0){
                              alpha = smoothstep(0.9,0.05,abs(vUv.y - 0.5)/0.5);
                      }else{
                              alpha = smoothstep(0.0,1.0,vUv.y);
                      }
                        vec2 st = vUv;
                        st = vec2(vUv.x,(vUv.y +time/20.)/2.0);
                        color += fbm6(st*3.0);
                        gl_FragColor = vec4(color,alpha);
                  }else if(type==3.0){
                          vec4 tex = texture2D( map,vec2(vUv.x,(vUv.y +fract(time/10.))/2.0));
                        gl_FragColor =  tex;
                  }else if(type==4.0){
                          float alpha;
                        if(dir==0.0){
                              alpha = smoothstep(0.0,1.0,vUv.y + sin(time)* 0.1);
                      }else if(dir==1.0){
                              alpha = smoothstep(1.0,0.0,vUv.y + sin(time)* 0.1);
                      }else if(dir==2.0){
                              alpha = smoothstep(0.7,0.05,(abs(vUv.y-0.5)+sin(time)* 0.1)/0.6);
                      }else if(dir==3.0){
                              // float alphax = smoothstep(1.0,0.0,progress);
                            // float alphax =1.2 -  sin(progress * 0.5 * 3.141592653589);
                            float alphax =1.0 -  pow(progress,3.0);
                            alpha = smoothstep(0.0,1.0,vUv.y);
                            alpha *= alphax;
                      }
                        gl_FragColor =  vec4(color,alpha);
                  }
              }`,
        };
        let meshMaterial = new THREE.ShaderMaterial({
                uniforms: shield.uniforms,
                defaultAttributeValues: {},
                vertexShader: shield.vertexShaderSource,
                fragmentShader: shield.fragmentShaderSource,
                // blending: THREE.NoBlending,
                blending: THREE.AdditiveBlending,
                depthWrite: !1,
                depthTest: !0,
                side: THREE.DoubleSide,
                transparent: !1,
                fog: !0,
        });
        animate();
        function animate() {
                shield.uniforms.time.value += 0.45;
                requestAnimationFrame(animate);
        }
        return meshMaterial;
};
export function RiseLineMaterial() {
        var uniforms = {
                map: {
                        type: "t",
                        value: null,
                },
                useMap: {
                        type: "f",
                        value: 0,
                },
                alphaMap: {
                        type: "f",
                        value: null,
                },
                useAlphaMap: {
                        type: "f",
                        value: 0,
                },
                resolution: {
                        type: "v2",
                        value: new THREE.Vector2(500, 500),
                },
                sizeAttenuation: {
                        type: "f",
                        value: 0,
                },
                near: {
                        type: "f",
                        value: 1,
                },
                far: {
                        type: "f",
                        value: 1,
                },
                dashArray: {
                        type: "f",
                        value: 0,
                },
                dashOffset: {
                        type: "f",
                        value: 0,
                },
                dashRatio: {
                        type: "f",
                        value: 0.5,
                },
                useDash: {
                        type: "f",
                        value: 0,
                },
                visibility: {
                        type: "f",
                        value: 1,
                },
                alphaTest: {
                        type: "f",
                        value: 0,
                },
                lineWidth: {
                        type: "f",
                        value: 6,
                },
                color: {
                        type: "c",
                        value: new THREE.Color("#9999FF"),
                },
                time: {
                        type: "f",
                        value: 0,
                },
                opacity: {
                        type: "f",
                        value: 1,
                },
                lineTex: {
                        type: "t",
                        value: new THREE.TextureLoader().load(
                                "static/texture/linear.png"
                        ),
                },
                repeat: {
                        type: "f",
                        value: 3,
                },
        };
        var vertexShaderSource = "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  "
                .concat(THREE.ShaderChunk.logdepthbuf_pars_vertex, "\n  ")
                .concat(
                        THREE.ShaderChunk.fog_pars_vertex,
                        "\n  attribute vec3 position;\n  attribute vec3 previous;\n  attribute vec3 next;\n  attribute float side;\n  attribute float width;\n  attribute vec2 uv;\n  attribute float counters;\n\n  uniform mat4 projectionMatrix;\n  uniform mat4 modelViewMatrix;\n  uniform vec2 resolution;\n  uniform float lineWidth;\n  uniform float near;\n  uniform float far;\n  uniform float sizeAttenuation;\n\n  varying vec2 vUv;\n  // varying float vCounters;\n\n  vec2 fix( vec4 i, float aspect ) {\n    vec2 res = i.xy / i.w;\n    res.x *= aspect;\n    // vCounters = counters;\n    return res;\n  }\n  void main() {\n    float aspect = resolution.x / resolution.y;\n    float pixelWidthRatio = 1. / (resolution.x * projectionMatrix[0][0]);\n    vUv = uv;\n\n    mat4 m = projectionMatrix * modelViewMatrix;\n    vec4 finalPosition = m * vec4( position, 1.0 );\n    vec4 prevPos = m * vec4( previous, 1.0 );\n    vec4 nextPos = m * vec4( next, 1.0 );\n\n    vec2 currentP = fix( finalPosition, aspect );\n    vec2 prevP = fix( prevPos, aspect );\n    vec2 nextP = fix( nextPos, aspect );\n\n    float pixelWidth = finalPosition.w * pixelWidthRatio;\n    float w = 1.8 * pixelWidth * lineWidth * width;\n\n    if( sizeAttenuation == 1. ) {\n      w = 1.8 * lineWidth * width;\n    }\n\n    vec2 dir;\n    if( nextP == currentP ) dir = normalize( currentP - prevP );\n    else if( prevP == currentP ) dir = normalize( nextP - currentP );\n    else {\n      vec2 dir1 = normalize( currentP - prevP );\n      vec2 dir2 = normalize( nextP - currentP );\n      dir = normalize( dir1 + dir2 );\n\n      vec2 perp = vec2( -dir1.y, dir1.x );\n      vec2 miter = vec2( -dir.y, dir.x );\n      //w = clamp( w / dot( miter, perp ), 0., 4. * lineWidth * width );\n    }\n\n    //vec2 normal = ( cross( vec3( dir, 0. ), vec3( 0., 0., 1. ) ) ).xy;\n    vec2 normal = vec2( -dir.y, dir.x );\n    normal.x /= aspect;\n    normal *= .5 * w;\n\n    vec4 offset = vec4( normal * side, 0.0, 1.0 );\n    finalPosition.xy += offset.xy;\n\n    gl_Position = finalPosition;\n    "
                )
                .concat(
                        THREE.ShaderChunk.logdepthbuf_vertex,
                        "\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    "
                )
                .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n");
        var fragmentShaderSource = "\n  #extension GL_OES_standard_derivatives : enable\n  precision highp float;\n  // precision highp int;\n  uniform vec3 color;\n  uniform float time;\n  uniform float opacity;\n  uniform sampler2D lineTex;\n  uniform float repeat;\n\n  "
                .concat(THREE.ShaderChunk.common, "\n  ")
                .concat(
                        THREE.ShaderChunk.fog_pars_fragment,
                        "\n\n  varying vec2 vUv;\n\n  void main() {\n    vec2 uv = vUv;\n    uv.x *= repeat;\n\n    float format = uv.x - time + 1.;\n    if (format > 1. || format < 0.) {\n      discard;\n    }\n    vec4 tex = texture2D(lineTex, vec2(uv.y, uv.x - time + 1.));\n    gl_FragColor = vec4(tex.rgb * color, opacity);\n\n    "
                )
                .concat(THREE.ShaderChunk.fog_fragment, "\n  }\n");
        let material = new THREE.RawShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShaderSource,
                fragmentShader: fragmentShaderSource,
                depthWrite: !1,
                depthTest: !0,
                depthFunc: THREE.AlwaysDepth,
                transparent: !0,
                opacity: 1,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
        });

        // animate();
        function animate() {
                uniforms.time.value += 0.045;
                requestAnimationFrame(animate);
        }
        return material;
};