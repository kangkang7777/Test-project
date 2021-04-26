varying vec2 vUv;
varying float noise;
uniform vec3 colLight;
uniform vec3 colNormal;
uniform vec3 colDark;
uniform float opacity;

//用于混合颜色
vec3 blend( vec3 cola, vec3 colb, float percent ) {
  return vec3(
    cola.r + (colb.r - cola.r) * percent,
    cola.g + (colb.g - cola.g) * percent,
    cola.b + (colb.b - cola.b) * percent
  );
}

void main() {

  vec3 col;
  float range = 1.0 * noise;

  if(range > 0.6)
      col = colDark;
  else if(range > 0.4)
      col = blend(colNormal, colDark, (range - 0.4) / 0.2);
  else
      col = blend(colLight, colNormal, range / 0.4);

//  if(range > .6)
//      col = colDark;
//  else if(range > .4)
//      col = colNormal;
//  else
//      col = colLight;

  gl_FragColor = vec4( col, opacity );
}
