#version 300 es

in vec2 aPosition;
uniform vec2 uResolution;

void main() {
    gl_Position = vec4((aPosition / uResolution) * 2.0f - 1.0f, 0, 1);
}
