export const ARRAY_BUFFER = 0x8892;

export const vertexShader = `#version 300 es
 
in vec2 aPosition;
uniform vec2 uResolution;

void main() {
  gl_Position = vec4((aPosition / uResolution) * 2.0 - 1.0, 0, 1);
}
`;

export const fragmentShader = `#version 300 es

precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(1, 0, 0.5, 1);
}
`;
