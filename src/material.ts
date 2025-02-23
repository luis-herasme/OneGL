import { GetUniformType, UniformTypeLabel, getUniformSetter, getUniformTypeLabel } from "./uniforms";
import { AttributeTypeLabel, GetAttributeType, getAttributeSetter, getAttributeTypeLabel } from "./attributes";

export type Uniforms = Record<string, UniformTypeLabel>;
export type Attributes = Record<string, AttributeTypeLabel>;

type MaterialData<A extends Attributes = Attributes, U extends Uniforms = Uniforms> = {
  gl: WebGL2RenderingContext;
  shader: {
    vertex: string;
    fragment: string;
  };
  attributes: A;
  uniforms: U;
};

export class Material<A extends Attributes = Attributes, U extends Uniforms = Uniforms> {
  public readonly program: WebGLProgram;

  public readonly uniforms: {
    locations: Record<keyof U, WebGLUniformLocation>;
    setters: {
      [K in keyof U]: (value: GetUniformType<U[K]>) => void;
    };
  };

  public readonly attributes: {
    locations: Record<keyof A, number>;
    buffers: Record<keyof A, WebGLBuffer>;
    setters: {
      [K in keyof A]: (value: GetAttributeType<A[K]>) => void;
    };
  };

  public readonly setUniform: <K extends keyof U>(name: K, value: GetUniformType<U[K]>) => void;
  public readonly setAttribute: <K extends keyof A>(name: K, value: GetAttributeType<A[K]>) => void;

  public readonly gl: WebGL2RenderingContext;

  constructor(data: MaterialData<A, U>) {
    const { gl } = data;

    const program = createWebGLProgram({
      gl,
      vertexSource: data.shader.vertex,
      fragmentSource: data.shader.fragment,
    });

    const uniforms = getUniforms(gl, program, data.uniforms);
    const attributes = getAttributes(gl, program, data.attributes);

    this.gl = gl;
    this.program = program;
    this.uniforms = uniforms;
    this.attributes = attributes;
    this.setUniform = (name, value) => uniforms.setters[name](value);
    this.setAttribute = (name, value) => attributes.setters[name](value);
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

function getAttributes<A extends Attributes>(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  attributes: A
): {
  locations: Record<keyof A, number>;
  setters: Record<keyof A, (value: GetAttributeType<A[keyof A]>) => void>;
  buffers: Record<keyof A, WebGLBuffer>;
} {
  const locations = {} as Record<keyof A, number>;
  const setters = {} as Record<keyof A, (value: GetAttributeType<A[keyof A]>) => void>;
  const buffers = {} as Record<keyof A, WebGLBuffer>;

  for (const attributeName in attributes) {
    // Get the location of the attribute
    const location = gl.getAttribLocation(program, attributeName);

    if (location === -1) {
      throw new Error(`Failed to get attribute location: ${attributeName}`);
    }

    locations[attributeName] = location;

    // Validate that the attribute type matches the expected type
    const attribute = gl.getActiveAttrib(program, location);

    if (!attribute) {
      throw new Error(`Failed to get attribute data: ${attributeName}`);
    }

    const typeLabel = getAttributeTypeLabel(attribute.type);
    const type = attributes[attributeName];

    if (typeLabel !== type) {
      throw new Error(`Attribute type mismatch: ${typeLabel} !== ${type}. For attribute: ${attributeName}`);
    }

    // Create a buffer for the attribute
    const buffer = gl.createBuffer();

    if (!buffer) {
      throw new Error(`Failed to create buffer for attribute: ${attributeName}`);
    }

    buffers[attributeName] = buffer;

    // Create a setter for the attribute
    const bufferSetter = getAttributeSetter(attribute.type)(gl, location);

    setters[attributeName] = (value: GetAttributeType<A[keyof A]>) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, value, gl.STATIC_DRAW);
      bufferSetter({ buffer });
    };
  }

  return {
    locations,
    setters,
    buffers,
  };
}

function getUniforms<U extends Uniforms>(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniforms: U
): {
  locations: Record<keyof U, WebGLUniformLocation>;
  setters: Record<keyof U, (value: GetUniformType<U[keyof U]>) => void>;
} {
  const locations = {} as Record<keyof U, WebGLUniformLocation>;
  const setters = {} as Record<keyof U, (value: GetUniformType<U[keyof U]>) => void>;

  const numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const uniformNames = new Set(Object.keys(uniforms));

  for (let i = 0; i < numberOfUniforms; i++) {
    const uniform = gl.getActiveUniform(program, i);

    if (!uniform) {
      throw new Error(`Failed to get uniform at index: ${i}`);
    }

    // Check that the uniform found was declared by the user
    if (!uniformNames.has(uniform.name)) {
      console.warn(`Unused uniform: ${uniform.name}`);
      continue;
    } else {
      uniformNames.delete(uniform.name);
    }

    // After the previous check, we can safely assume that uniform.name is a keyof U
    const uniformName = uniform.name as keyof U;

    const location = gl.getUniformLocation(program, uniform.name);

    if (!location) {
      throw new Error(`Failed to get uniform location: ${uniform.name}`);
    }

    locations[uniformName] = location;

    // Validate that the uniform type matches the expected type
    const typeLabel = getUniformTypeLabel(uniform.type);
    const type = uniforms[uniformName];

    if (typeLabel !== type) {
      throw new Error(`Uniform type mismatch: ${typeLabel} !== ${type}. For uniform: ${uniform.name}`);
    }

    // Create a setter for the uniform
    // We can safely assume that setterCreator will return a setter for the correct type
    // because we have already validated that the uniform type matches the expected type
    const setterCreator = getUniformSetter(uniform.type);
    const setter = setterCreator(gl, location) as (value: GetUniformType<typeof typeLabel>) => void;
    setters[uniformName] = setter;
  }

  // Check for any missing uniforms
  if (uniformNames.size > 0) {
    throw new Error(`Missing uniforms: ${Array.from(uniformNames).join(", ")}`);
  }

  return {
    locations,
    setters,
  };
}
