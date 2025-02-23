import { Matrix } from "./matrix";
import Renderer from "./renderer";
import { createQuad } from "./primitives";
import { vertexShader, fragmentShader } from "./shaders";
import { Material } from "./program";

const renderer = new Renderer();

const material = Material({
  gl: renderer.gl,
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

const quad = createQuad({
  width: 100,
  height: 50,
});

let angle = 0;

renderer.gl.useProgram(material.program);

function render() {
  renderer.resizeCanvasToDisplaySize();
  renderer.clearScreen();

  angle += 0.1;

  const transform = new Matrix();
  transform.translate(renderer.canvas.width / 2, renderer.canvas.height / 2);
  transform.rotate(angle);
  transform.translate(-50, -25);

  material.setUniform("uTransform", transform.data);
  material.setUniform("uProjection", Matrix.projection(renderer.canvas.width, renderer.canvas.height));
  material.setUniform("uColor", [1, 0, 0, 1]);

  material.setAttribute("aPosition", quad);

  renderer.gl.drawArrays(renderer.gl.TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}

render();
