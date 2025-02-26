#version 300 es

precision highp float;

in vec2 vTexcoord;

uniform sampler2D modelTexture;

out vec4 outColor;

void main() {
  outColor = texture(modelTexture, vTexcoord);
}
