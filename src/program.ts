import { ATTRIBUTE_SETTERS, AttributeTypeLabel, GetAttributeType } from "./attributes";
import { GetUniformType, UNIFORM_SETTERS, UniformTypeLabel, WEBGL_TO_UNIFORM_TYPE } from "./uniforms";

type ProgramDefinitionUniforms = Record<string, UniformTypeLabel>;
type ProgramDefinitionAttributes = Record<string, AttributeTypeLabel>;

type ProgramData<A extends ProgramDefinitionAttributes, U extends ProgramDefinitionUniforms> = {
  vertexShader: string;
  fragmentShader: string;
  attributes: A;
  uniforms: U;
};

type UniformSetters = {
  [T in UniformTypeLabel]: (value: GetUniformType<T>) => void;
};

type Program<A extends ProgramDefinitionAttributes, U extends ProgramDefinitionUniforms> = {
  webglProgram: WebGLProgram;
  uniforms: {
    locations: Record<keyof U, WebGLUniformLocation>;
    setters: {
      [T in keyof U]: UniformSetters[U[T]];
    };
  };
  attributes: {
    locations: Record<keyof A, number>;
    setters: Record<keyof A, (value: GetAttributeType<A[keyof A]>) => void>;
  };
  buffers: Record<string, WebGLBuffer>;
  use: () => void;
};

export class ProgramManager {
  readonly gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  create<A extends ProgramDefinitionAttributes, U extends ProgramDefinitionUniforms>(
    programData: ProgramData<A, U>
  ): Program<A, U> {
    const webglProgram = this.createWebGLProgram(programData);

    const buffers = this.createBuffers(webglProgram);

    const attributeLocations = this.getAttributeLocations(webglProgram);
    const attributeSetters = this.getAttributeSetters(webglProgram, buffers);

    const uniformLocations = this.getUniformLocations(webglProgram);
    const uniformSetters = this.getUniformSetters(webglProgram);

    return {
      webglProgram,
      uniforms: {
        locations: uniformLocations,
        setters: uniformSetters,
      },
      attributes: {
        locations: attributeLocations,
        setters: attributeSetters,
      },
      buffers,
      use: () => {
        this.gl.useProgram(webglProgram);
      },
    } as Program<A, U>;
  }

  private createWebGLProgram(programData: ProgramData<any, any>): WebGLProgram {
    const program = this.gl.createProgram();

    if (!program) {
      throw new Error("Failed to create program");
    }

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, programData.vertexShader);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, programData.fragmentShader);

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);

    this.gl.linkProgram(program);

    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const log = this.gl.getProgramInfoLog(program);
      this.gl.deleteProgram(program);
      throw new Error(`Failed to link program: ${log}`);
    }

    return program;
  }

  private createShader(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);

    if (!shader) {
      throw new Error("Failed to create shader");
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      this.gl.deleteShader(shader);
      const log = this.gl.getShaderInfoLog(shader);
      throw new Error(`Failed to compile shader: ${log}`);
    }

    return shader;
  }

  private getAttributeLocations(program: WebGLProgram): Record<string, number> {
    const numberOfAttributes = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
    const locations: Record<string, number> = {};

    for (let i = 0; i < numberOfAttributes; i++) {
      const attribute = this.gl.getActiveAttrib(program, i);

      if (!attribute) {
        throw new Error(`Failed to get attribute at index: ${i}`);
      }

      const location = this.gl.getAttribLocation(program, attribute.name);

      if (location === -1) {
        throw new Error(`Failed to get attribute location: ${attribute.name}`);
      }

      locations[attribute.name] = location;
    }

    return locations;
  }

  private getUniformLocations(program: WebGLProgram): Record<string, WebGLUniformLocation> {
    const numberOfUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    const locations: Record<string, WebGLUniformLocation> = {};

    for (let i = 0; i < numberOfUniforms; i++) {
      const uniform = this.gl.getActiveUniform(program, i);

      if (!uniform) {
        throw new Error(`Failed to get uniform at index: ${i}`);
      }

      const location = this.gl.getUniformLocation(program, uniform.name);

      if (!location) {
        throw new Error(`Failed to get uniform location: ${uniform.name}`);
      }

      locations[uniform.name] = location;
    }

    return locations;
  }

  private getUniformSetters(program: WebGLProgram): Record<string, (value: any) => void> {
    const numberOfUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    const setters: Record<string, (value: any) => void> = {};

    for (let i = 0; i < numberOfUniforms; i++) {
      const uniform = this.gl.getActiveUniform(program, i);

      if (!uniform) {
        throw new Error(`Failed to get uniform at index: ${i}`);
      }

      const location = this.gl.getUniformLocation(program, uniform.name);

      if (!location) {
        throw new Error(`Failed to get uniform location: ${uniform.name}`);
      }

      const createSetter = UNIFORM_SETTERS[uniform.type as keyof typeof WEBGL_TO_UNIFORM_TYPE];
      if (!createSetter) {
        throw new Error(`Unsupported uniform type: ${uniform.type}`);
      }

      setters[uniform.name] = createSetter(this.gl, location);
    }

    return setters;
  }

  private getAttributeSetters(
    program: WebGLProgram,
    buffers: Record<string, WebGLBuffer>
  ): Record<string, (value: any) => void> {
    const numberOfAttributes = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
    const setters: Record<string, (value: any) => void> = {};

    for (let i = 0; i < numberOfAttributes; i++) {
      const attribute = this.gl.getActiveAttrib(program, i);

      if (!attribute) {
        throw new Error(`Failed to get attribute at index: ${i}`);
      }

      const location = this.gl.getAttribLocation(program, attribute.name);

      if (location === -1) {
        throw new Error(`Failed to get attribute location: ${attribute.name}`);
      }

      const createSetter = ATTRIBUTE_SETTERS[attribute.type as keyof typeof ATTRIBUTE_SETTERS];
      if (!createSetter) {
        throw new Error(`Unsupported attribute type: ${attribute.type}`);
      }

      const bufferSetter = createSetter(this.gl, location);

      const setter = (value: any) => {
        const buffer = buffers[attribute.name];
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, value, this.gl.STATIC_DRAW);
        bufferSetter({ buffer });
      };

      setters[attribute.name] = setter;
    }

    return setters;
  }

  private createBuffers(program: WebGLProgram): Record<string, WebGLBuffer> {
    const numberOfAttributes = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
    const buffers: Record<string, WebGLBuffer> = {};

    for (let i = 0; i < numberOfAttributes; i++) {
      const attribute = this.gl.getActiveAttrib(program, i);

      if (!attribute) {
        throw new Error(`Failed to get attribute at index: ${i}`);
      }

      const buffer = this.gl.createBuffer();

      if (!buffer) {
        throw new Error(`Failed to create buffer for attribute: ${attribute.name}`);
      }

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
      buffers[attribute.name] = buffer;
    }

    return buffers;
  }
}
