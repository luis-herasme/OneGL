import Canvas from "./renderer";
import { QuadGeometry } from "./primitives";
import { vertexShader, fragmentShader } from "./shaders";
import { Material } from "./material";
import { Mesh } from "./mesh";

const canvas = new Canvas();

const material = new Material({
  gl: canvas.gl,
  shader: {
    vertex: vertexShader,
    fragment: fragmentShader,
  },
  attributes: {
    aPosition: "vec2",
  },
  uniforms: {
    uProjection: "mat3",
    uTransform: "mat3",
    uColor: "vec4",
  },
});

const quad = new QuadGeometry({
  width: 100,
  height: 50,
});

const mesh = new Mesh({ material, geometry: quad });

material.setUniform("uColor", [1, 0, 0, 1]);
mesh.transform.translate(window.innerWidth / 2, window.innerHeight / 2);

function render() {
  canvas.clearScreen();

  mesh.transform.rotate(0.1);
  mesh.render();

  requestAnimationFrame(render);
}

render();
