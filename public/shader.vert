#version 300 es

in vec3 modelPosition;

uniform mat4 cameraProjection;
uniform mat4 cameraInverseTransform;
uniform mat4 modelTransform;
uniform vec4 modelColor;

out vec4 vColor;

void main() {
    vec4 worldPosition = modelTransform*vec4(modelPosition, 1.0f);
    gl_Position = cameraProjection*cameraInverseTransform*worldPosition;
    vColor = modelColor;
}
