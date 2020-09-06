uniform float time;
uniform vec3 color;
uniform float type;
uniform float num;
varying vec2 vUv;\n
void main(){
  float alpha=1.;
  float dis=distance(vUv,vec2(.5));//0-0.5
  if(dis>.5){
    discard;
  }
  if(type==0.){
    float y=(sin(6.*num*(dis-time))+1.)/2.;
    alpha=smoothstep(1.,0.,abs(y-.5)/.5)*(.5-dis)*2.;
  }else if(type==1.){
    float step=fract(time*4.)*.5;
    if(dis<step){
      // alpha = smoothstep(1.0,0.0,abs(step-dis)/0.15);
      alpha=1.-abs(step-dis)/.15;
    }else{
      alpha=smoothstep(1.,0.,abs(step-dis)/.05);
    }
    alpha*=(pow((.5-dis)*3.,2.));
  }
  gl_FragColor=vec4(color,alpha);
}