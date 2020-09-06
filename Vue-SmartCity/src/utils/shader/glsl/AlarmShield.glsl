#extension GL_OES_standard_derivatives:enable
uniform float time;
uniform float opacity;
varying vec2 vUv;
void main(void)
{
  float t=time*.1;
  if(vUv.y<.5){
    discard;
  }
  vec2 uv=vec2(vUv.x-.25,vUv.y-.5);
  
  vec2 ouv=uv;
  vec3 rd=normalize(vec3(uv,2.));
  rd.xy*=mat2(cos(t),sin(t),-sin(t),cos(t));
  vec3 ro=vec3(t+sin(t*6.53583)*.05,.01+sin(t*352.4855)*.0015,-t*3.);
  vec3 p=ro;
  float v=0.,td=-mod(ro.z,.005);
  for(int r=0;r<150;r++){
    v+=pow(max(0.,.01-length(abs(.01-mod(p,.02))))/.01,10.)*exp(-2.*pow((1.+td),2.));
    p=ro+rd*td;
    td+=.005;
  }
  gl_FragColor=vec4(v,v*v,v*v*v,0.)*8.*max(0.,1.-length(ouv*ouv)*2.5);
  gl_FragColor.a=opacity;
}