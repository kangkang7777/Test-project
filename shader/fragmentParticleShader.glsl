uniform vec3 color;
uniform sampler2D texture1;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4( vColor, 1.0 );
  gl_FragColor = gl_FragColor * texture2D( texture1, gl_PointCoord );
}