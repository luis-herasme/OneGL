import { Texture } from "./texture";
import { Material } from "./material";
import { assertNever } from "./utils/assert-never";

class Uniform<T extends UniformTypeLabel> {
  readonly name: string;
  readonly type: T;
  readonly material: Material;
  readonly location: WebGLUniformLocation;
  readonly set: (value: UniformTypeMap[T]) => void;

  constructor({
    gl,
    name,
    type,
    program,
    material,
  }: {
    gl: WebGL2RenderingContext;
    name: string;
    type: T;
    program: WebGLProgram;
    material: Material;
  }) {
    this.name = name;
    this.type = type;
    this.material = material;

    this.location = this.getLocation(gl, program);
    this.validateUniformCompatibility(gl, program);
    this.set = this.createSetterFunction(gl) as (value: UniformTypeMap[T]) => void;
  }

  private getLocation(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const location = gl.getUniformLocation(program, this.name);

    if (!location) {
      throw new Error(`Failed to get uniform location: ${name}`);
    }

    return location;
  }

  private validateUniformCompatibility(gl: WebGL2RenderingContext, program: WebGLProgram) {
    const information = this.getInformation(gl, program);

    if (!information) {
      throw new Error(`Failed to get uniform data: ${this.name}`);
    }

    const type = WEBGL_TO_UNIFORM_TYPE[information.type];

    if (type === undefined) {
      throw new Error(`Unsupported uniform type: ${information.type}`);
    }

    if (type !== this.type) {
      throw new Error(`Uniform type mismatch: ${type} !== ${this.type}. For uniform: ${information.name}`);
    }
  }

  private getInformation(gl: WebGL2RenderingContext, program: WebGLProgram): WebGLActiveInfo | null {
    const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < numUniforms; i++) {
      const info = gl.getActiveUniform(program, i);

      if (info && info.name === this.name) {
        return info;
      }
    }

    return null;
  }

  private createSetterFunction(gl: WebGL2RenderingContext) {
    const { location, type, material } = this;

    // prettier-ignore
    switch (type) {
      case "float":   return (value: UniformTypeMap["float"]) => gl.uniform1f(location, value);
      case "vec2":    return (value: UniformTypeMap["vec2"]) => gl.uniform2fv(location, value);
      case "vec3":    return (value: UniformTypeMap["vec3"]) => gl.uniform3fv(location, value);
      case "vec4":    return (value: UniformTypeMap["vec4"]) => gl.uniform4fv(location, value);

      case "int":     return (value: UniformTypeMap["int"]) => gl.uniform1i(location, value);
      case "ivec2":   return (value: UniformTypeMap["ivec2"]) => gl.uniform2iv(location, value);
      case "ivec3":   return (value: UniformTypeMap["ivec3"]) => gl.uniform3iv(location, value);
      case "ivec4":   return (value: UniformTypeMap["ivec4"]) => gl.uniform4iv(location, value);

      case "uint":    return (value: UniformTypeMap["uint"]) => gl.uniform1ui(location, value);
      case "uvec2":   return (value: UniformTypeMap["uvec2"]) => gl.uniform2uiv(location, value);
      case "uvec3":   return (value: UniformTypeMap["uvec3"]) => gl.uniform3uiv(location, value);
      case "uvec4":   return (value: UniformTypeMap["uvec4"]) => gl.uniform4uiv(location, value);

      case "bool":    return (value: UniformTypeMap["bool"]) => gl.uniform1i(location, value);
      case "bvec2":   return (value: UniformTypeMap["bvec2"]) => gl.uniform2iv(location, value);
      case "bvec3":   return (value: UniformTypeMap["bvec3"]) => gl.uniform3iv(location, value);
      case "bvec4":   return (value: UniformTypeMap["bvec4"]) => gl.uniform4iv(location, value);

      case "mat2":    return (value: UniformTypeMap["mat2"]) => gl.uniformMatrix2fv(location, false, value);
      case "mat3":    return (value: UniformTypeMap["mat3"]) => gl.uniformMatrix3fv(location, false, value);
      case "mat4":    return (value: UniformTypeMap["mat4"]) => gl.uniformMatrix4fv(location, false, value);

      case "sampler2D": return (value: UniformTypeMap["sampler2D"]) =>
        material.setTexture({
          uniformLocation: location,
          texture: value,
        });

      default:        return assertNever(type); // Ensures exhaustive handling
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
  material,
}: {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uniforms: U;
  material: Material;
}): Uniforms<U> {
  const uniformsMap: Record<string, Uniform<any>> = {};

  for (const [name, type] of Object.entries(uniforms)) {
    uniformsMap[name] = new Uniform({ gl, name, type, program, material });
  }

  return uniformsMap as Uniforms<U>;
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
  sampler2D: Texture;
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

  SAMPLER_2D = 0x8b5e,
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

  [WebGLUniformType.SAMPLER_2D]: "sampler2D",
};
