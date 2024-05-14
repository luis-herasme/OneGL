#version 300 es

in vec2 aPosition;
uniform mat3 uProjection;
uniform mat3 uTransform;
uniform vec4 uColor;

out vec4 vColor;

void main() {
    vec3 position = uProjection * uTransform * vec3(aPosition, 1.0);
    gl_Position = vec4(position.xy, 0.0, 1.0);
    vColor = uColor;
}
