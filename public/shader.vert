#version 300 es

in vec3 position;
in vec2 texcoord;

uniform mat4 projectionMatrix;
uniform mat4 cameraInverseMatrix;
uniform mat4 modelMatrix;

out vec2 vTexcoord;

void main() {
    gl_Position = projectionMatrix*cameraInverseMatrix*modelMatrix*vec4(position, 1.0f);
    vTexcoord = texcoord;
}
