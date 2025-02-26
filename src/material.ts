import { Texture } from "./texture";
import { UniformsDefinitions, getUniforms, Uniforms } from "./uniforms";
import { Attributes, GetAttributeType, getAttributes } from "./attributes";

type MaterialData<A extends Attributes, U extends UniformsDefinitions> = {
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

export class Material<A extends Attributes = Attributes, U extends UniformsDefinitions = UniformsDefinitions> {
  public readonly program: WebGLProgram;
  public readonly uniforms: Uniforms<U>;

  public readonly attributes: {
    locations: Record<keyof A, number>;
    setters: {
      [K in keyof A]: (value: GetAttributeType<A[K]>, buffer: WebGLBuffer) => void;
    };
  };

  public readonly setAttribute: <K extends keyof A>(
    name: K,
    value: GetAttributeType<A[K]>,
    buffer: WebGLBuffer
  ) => void;

  public readonly gl: WebGL2RenderingContext;

  textures: MaterialTexture[] = [];

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

  constructor(data: MaterialData<A, U>) {
    const { gl } = data;

    const program = createWebGLProgram({
      gl,
      vertexSource: data.shader.vertex,
      fragmentSource: data.shader.fragment,
    });

    const uniforms = getUniforms({
      gl,
      program,
      uniforms: data.uniforms,
      material: this as any,
    });

    const attributes = getAttributes({
      gl,
      program,
      attributes: data.attributes,
    });

    this.gl = gl;
    this.program = program;
    this.uniforms = uniforms;
    this.attributes = attributes;
    this.setAttribute = (name, value, buffer) => attributes.setters[name](value, buffer);
  }
}

function createWebGLProgram({
  gl,
  vertexSource,
  fragmentSource,
}: {
  gl: WebGL2RenderingContext;
  vertexSource: string;
  fragmentSource: string;
}): WebGLProgram {
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Failed to create program");
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);

    if (!log) {
      throw new Error("Failed to link program: no log available");
    }

    throw new Error(`Failed to link program: ${log}`);
  }

  return program;
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Failed to create shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);

    if (!log) {
      throw new Error("Failed to compile shader: no log available");
    }

    throw new Error(`Failed to compile shader: ${log}`);
  }

  return shader;
}
