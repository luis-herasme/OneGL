import { createProgram } from "./program";
import type { ProgramData, AttributesDeclaration, UniformsDeclaration } from "./program";

type RendererConfig = {
  clearColor: {
    r: number;
    g: number;
    b: number;
    a?: number;
  };
};

const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  clearColor: {
    r: 0.2,
    g: 0.2,
    b: 0.2,
  },
};

class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGL2RenderingContext;

  constructor({ clearColor }: RendererConfig = DEFAULT_RENDERER_CONFIG) {
    this.canvas = document.createElement("canvas");
    const gl = this.canvas.getContext("webgl2");

    if (!gl) {
      throw new Error("WebGL2 is not supported");
    }

    this.gl = gl;

    gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a ?? 1.0);
    document.body.appendChild(this.canvas);
  }

  createProgram<A extends AttributesDeclaration, U extends UniformsDeclaration>(programData: ProgramData<A, U>) {
    return createProgram(this.gl, programData);
  }

  clearScreen() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  resizeCanvasToDisplaySize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }
}

export default Renderer;
