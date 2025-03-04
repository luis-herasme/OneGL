#version 300 es

precision highp float;

in vec2 vTexcoord;

uniform sampler2D modelTexture;
uniform vec3 negativeLightDirection;

in vec3 vNormal;
out vec4 outColor;

void main() {
  vec3 normal = normalize(vNormal);
  float light = dot(normal, negativeLightDirection);
  outColor = texture(modelTexture, vTexcoord);
  outColor.rgb *= light;
}
