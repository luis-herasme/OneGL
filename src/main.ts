import Renderer from "./renderer";
import { fragmentShader, vertexShader } from "./constants";

const renderer = new Renderer();

const program = renderer.createProgram({
  vertexShader,
  fragmentShader,
  attributes: {
    aPosition: "vec2",
  },
  uniforms: {
    uResolution: "vec2",
    euri: "float",
  },
});

renderer.clearScreen();
program.use();

program.setUniform("uResolution", [renderer.canvas.width, renderer.canvas.height]);
program.setAttribute("aPosition", new Float32Array([0, 0, 0, 40, 40, 0]));
renderer.gl.drawArrays(renderer.gl.TRIANGLES, 0, 3);
