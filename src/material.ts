import { Texture } from "./texture";
import { createWebGLProgram } from "./program";
import { UniformsDefinitions, getUniforms, Uniforms } from "./uniforms";
import { AttributesDefinitions, getAttributes, Attributes } from "./attributes";

type MaterialData<A extends AttributesDefinitions, U extends UniformsDefinitions> = {
  gl: WebGL2RenderingContext;
  shader: {
    vertex: string;
    fragment: string;
  };
  attributes: A;
  uniforms: U;
};

type MaterialTexture = {
  id: number;
  texture: Texture;
  uniformLocation: WebGLUniformLocation;
};

export class Material<
  A extends AttributesDefinitions = AttributesDefinitions,
  U extends UniformsDefinitions = UniformsDefinitions
> {
  public readonly gl: WebGL2RenderingContext;
  public readonly program: WebGLProgram;
  public readonly uniforms: Uniforms<U>;
  public readonly attributes: Attributes<A>;
  public readonly textures: MaterialTexture[] = [];

  setTexture(data: MaterialTexture) {
    for (let i = 0; i < this.textures.length; i++) {
      const item = this.textures[i];

      if (item === undefined) {
        continue;
      }

      if (item.texture === data.texture) {
        return;
      }

      if (item.id === data.id) {
        item.texture = data.texture;
        return;
      }
    }

    this.textures.push(data);
  }

  public use() {
    this.gl.useProgram(this.program);
  }

  constructor(data: MaterialData<A, U>) {
    this.gl = data.gl;

    this.program = createWebGLProgram({
      gl: this.gl,
      vertexSource: data.shader.vertex,
      fragmentSource: data.shader.fragment,
    });

    this.uniforms = getUniforms({
      gl: this.gl,
      program: this.program,
      uniforms: data.uniforms,
      material: this as any,
    });

    this.attributes = getAttributes({
      gl: this.gl,
      program: this.program,
      attributes: data.attributes,
    });
  }
}
