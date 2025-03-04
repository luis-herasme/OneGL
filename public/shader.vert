#version 300 es

in vec3 position;
in vec2 texcoord;
in vec3 normals;

uniform mat4 projectionMatrix;
uniform mat4 cameraInverseMatrix;
uniform mat4 modelMatrix;

out vec2 vTexcoord;
out vec3 vNormal;

void main() {
    gl_Position = projectionMatrix*cameraInverseMatrix*modelMatrix*vec4(position, 1.0f);
    vTexcoord = texcoord;
    vNormal = mat3(modelMatrix)*normals;
}
