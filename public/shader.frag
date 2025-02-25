#version 300 es

precision highp float;

in vec2 vTexcoord;

uniform sampler2D uSampler;

out vec4 outColor;

void main() {
  outColor = texture(uSampler, vTexcoord);
}
