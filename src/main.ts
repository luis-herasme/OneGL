import { Matrix } from "./matrix";
import Renderer from "./renderer";
import { createQuad } from "./primitives";
import { vertexShader, fragmentShader } from "./shaders";

const renderer = new Renderer();

const program = renderer.createProgram({
  vertexShader,
  fragmentShader,
  attributes: {
    aPosition: "vec2",
  },
  uniforms: {
    uProjection: "mat3",
    uTransform: "mat3",
    uColor: "vec4",
  },
});

program.use();

const quad = createQuad(100, 50);

let angle = 0;

function render() {
  renderer.resizeCanvasToDisplaySize();
  renderer.clearScreen();

  angle += 0.1;

  const transform = new Matrix();
  transform.translate(renderer.canvas.width / 2, renderer.canvas.height / 2);
  transform.rotate(angle);
  transform.translate(-50, -25);

  program.setUniform("uTransform", transform.data);
  program.setUniform("uProjection", Matrix.projection(renderer.canvas.width, renderer.canvas.height));
  program.setUniform("uColor", [1, 0, 0, 1]);

  program.setAttribute("aPosition", quad);

  renderer.gl.drawArrays(renderer.gl.TRIANGLES, 0, 6);

  requestAnimationFrame(render);
}

render();
