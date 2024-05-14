#version 300 es

in vec2 aPosition;
uniform mat3 uMatrix;
uniform vec4 uColor;

out vec4 vColor;

void main() {
    gl_Position = vec4((uMatrix * vec3(aPosition, 1)).xy, 0.0f, 1.0f);
    vColor = uColor;
}
