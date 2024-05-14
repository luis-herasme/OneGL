export const vertexShader = await fetch("/shader.vert").then((response) => response.text());
export const fragmentShader = await fetch("/shader.frag").then((response) => response.text());
