vec3 rands(vec3 c){
  float j=4096.*sin(dot(c,vec3(17.,59.4,15.)));
  
  vec3 r;
  r.z=fract(512.*j);
  j*=.125;
  r.x=fract(512.*j);
  j*=.125;
  r.y=fract(512.*j);
  return r-.5;
}