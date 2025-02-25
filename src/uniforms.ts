import { assertNever } from "./utils/assert-never";

class Uniform<T extends UniformTypeLabel> {
  readonly gl: WebGL2RenderingContext;
  readonly type: UniformTypeLabel;
  readonly location: WebGLUniformLocation;

  constructor(gl: WebGL2RenderingContext, type: UniformTypeLabel, location: WebGLUniformLocation) {
    this.gl = gl;
    this.type = type;
    this.location = location;
  }

  set(value: UniformTypeMap[T]): void {
    switch (this.type) {
      case "float":
        this.gl.uniform1f(this.location, value as UniformTypeMap["float"]);
        break;
      case "vec2":
        this.gl.uniform2fv(this.location, value as UniformTypeMap["vec2"]);
        break;
      case "vec3":
        this.gl.uniform3fv(this.location, value as UniformTypeMap["vec3"]);
        break;
      case "vec4":
        this.gl.uniform4fv(this.location, value as UniformTypeMap["vec4"]);
        break;
      case "int":
        this.gl.uniform1i(this.location, value as UniformTypeMap["int"]);
        break;
      case "ivec2":
        this.gl.uniform2iv(this.location, value as UniformTypeMap["ivec2"]);
        break;
      case "ivec3":
        this.gl.uniform3iv(this.location, value as UniformTypeMap["ivec3"]);
        break;
      case "ivec4":
        this.gl.uniform4iv(this.location, value as UniformTypeMap["ivec4"]);
        break;
      case "uint":
        this.gl.uniform1ui(this.location, value as UniformTypeMap["uint"]);
        break;
      case "uvec2":
        this.gl.uniform2uiv(this.location, value as UniformTypeMap["uvec2"]);
        break;
      case "uvec3":
        this.gl.uniform3uiv(this.location, value as UniformTypeMap["uvec3"]);
        break;
      case "uvec4":
        this.gl.uniform4uiv(this.location, value as UniformTypeMap["uvec4"]);
        break;
      case "bool":
        this.gl.uniform1i(this.location, value as UniformTypeMap["bool"]);
        break;
      case "bvec2":
        this.gl.uniform2iv(this.location, value as UniformTypeMap["bvec2"]);
        break;
      case "bvec3":
        this.gl.uniform3iv(this.location, value as UniformTypeMap["bvec3"]);
        break;
      case "bvec4":
        this.gl.uniform4iv(this.location, value as UniformTypeMap["bvec4"]);
        break;
      case "mat2":
        this.gl.uniformMatrix2fv(this.location, false, value as UniformTypeMap["mat2"]);
        break;
      case "mat3":
        this.gl.uniformMatrix3fv(this.location, false, value as UniformTypeMap["mat3"]);
        break;
      case "mat4":
        this.gl.uniformMatrix4fv(this.location, false, value as UniformTypeMap["mat4"]);
        break;
      default:
        assertNever(this.type);
    }
  }
}

export type UniformsDefinitions = Record<string, UniformTypeLabel>;
export type Uniforms<U extends UniformsDefinitions> = {
  [K in keyof U]: Uniform<U[K]>;
};

export function getUniforms<U extends UniformsDefinitions>({
  gl,
  program,
  uniforms,
}: {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uniforms: U;
}): Uniforms<U> {
  const uniformsMap = {} as Uniforms<U>;
  const numberOfUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  const uniformsNotFound = new Set(Object.keys(uniforms));

  for (let i = 0; i < numberOfUniforms; i++) {
    const uniform = gl.getActiveUniform(program, i);

    if (!uniform) {
      throw new Error(`Failed to get uniform at index: ${i}`);
    }

    // Check that the uniform found was declared by the user
    if (uniformsNotFound.has(uniform.name)) {
      uniformsNotFound.delete(uniform.name);
    } else {
      console.warn(`Unused uniform: ${uniform.name}`);
      continue;
    }

    // After the previous check, we can safely assume that uniform.name is a keyof U
    const uniformName = uniform.name as keyof U;
    const location = gl.getUniformLocation(program, uniform.name);

    if (!location) {
      throw new Error(`Failed to get uniform location: ${uniform.name}`);
    }

    // Validate that the uniform type matches the expected type
    // const type = getUniformTypeLabel(uniform.type);

    const type = WEBGL_TO_UNIFORM_TYPE[uniform.type];

    if (type !== uniforms[uniformName]) {
      throw new Error(`Uniform type mismatch: ${type} !== ${uniforms[uniformName]}. For uniform: ${uniform.name}`);
    }

    uniformsMap[uniformName] = new Uniform(gl, type, location);
  }

  // Check for any missing uniforms
  if (uniformsNotFound.size > 0) {
    throw new Error(`Missing uniforms: ${Array.from(uniformsNotFound).join(", ")}`);
  }

  return uniformsMap;
}

type UniformTypeLabel = keyof UniformTypeMap;

// prettier-ignore
type UniformTypeMap = {
  float: number;
  vec2: [number, number];
  vec3: [number, number, number];
  vec4: [number, number, number, number];

  int: number;
  ivec2: [number, number];
  ivec3: [number, number, number];
  ivec4: [number, number, number, number];

  uint: number;
  uvec2: [number, number];
  uvec3: [number, number, number];
  uvec4: [number, number, number, number];

  bool: number;
  bvec2: [number, number];
  bvec3: [number, number, number];
  bvec4: [number, number, number, number];

  mat2: [
    number, number,
    number, number
  ];
  mat3: [
    number, number, number,
    number, number, number,
    number, number, number
  ];
  mat4: [
    number, number, number, number,
    number, number, number, number,
    number, number, number, number,
    number, number, number, number
  ];
};

enum WebGLUniformType {
  FLOAT = 0x1406,
  FLOAT_VEC2 = 0x8b50,
  FLOAT_VEC3 = 0x8b51,
  FLOAT_VEC4 = 0x8b52,

  INT = 0x1404,
  INT_VEC2 = 0x8b53,
  INT_VEC3 = 0x8b54,
  INT_VEC4 = 0x8b55,

  UNSIGNED_INT = 0x1405,
  UNSIGNED_INT_VEC2 = 0x8dc6,
  UNSIGNED_INT_VEC3 = 0x8dc7,
  UNSIGNED_INT_VEC4 = 0x8dc8,

  BOOL = 0x8b56,
  BOOL_VEC2 = 0x8b57,
  BOOL_VEC3 = 0x8b58,
  BOOL_VEC4 = 0x8b59,

  FLOAT_MAT2 = 0x8b5a,
  FLOAT_MAT3 = 0x8b5b,
  FLOAT_MAT4 = 0x8b5c,
}

const WEBGL_TO_UNIFORM_TYPE: Record<number, UniformTypeLabel | undefined> = {
  [WebGLUniformType.FLOAT]: "float",
  [WebGLUniformType.FLOAT_VEC2]: "vec2",
  [WebGLUniformType.FLOAT_VEC3]: "vec3",
  [WebGLUniformType.FLOAT_VEC4]: "vec4",

  [WebGLUniformType.INT]: "int",
  [WebGLUniformType.INT_VEC2]: "ivec2",
  [WebGLUniformType.INT_VEC3]: "ivec3",
  [WebGLUniformType.INT_VEC4]: "ivec4",

  [WebGLUniformType.UNSIGNED_INT]: "uint",
  [WebGLUniformType.UNSIGNED_INT_VEC2]: "uvec2",
  [WebGLUniformType.UNSIGNED_INT_VEC3]: "uvec3",
  [WebGLUniformType.UNSIGNED_INT_VEC4]: "uvec4",

  [WebGLUniformType.BOOL]: "bool",
  [WebGLUniformType.BOOL_VEC2]: "bvec2",
  [WebGLUniformType.BOOL_VEC3]: "bvec3",
  [WebGLUniformType.BOOL_VEC4]: "bvec4",

  [WebGLUniformType.FLOAT_MAT2]: "mat2",
  [WebGLUniformType.FLOAT_MAT3]: "mat3",
  [WebGLUniformType.FLOAT_MAT4]: "mat4",
};
