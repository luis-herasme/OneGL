import Renderer from "./renderer";
import { fragmentShader, vertexShader } from "./constants";

const renderer = new Renderer();

const program = renderer.program.create({
  vertexShader,
  fragmentShader,
  attributes: {
    aPosition: "vec2",
  },
  uniforms: {
    uResolution: "vec2",
    luis: "int",
  },
});

renderer.clearScreen();
program.use();

program.uniforms.setters.uResolution([renderer.canvas.width, renderer.canvas.height]);
program.attributes.setters.aPosition(new Float32Array([0, 0, 0, 40, 40, 0]));
renderer.gl.drawArrays(renderer.gl.TRIANGLES, 0, 3);
