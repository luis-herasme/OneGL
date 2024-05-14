import { ARRAY_BUFFER } from "./constants";

const FLOAT = 0x1406;
const FLOAT_VEC2 = 0x8b50;
const FLOAT_VEC3 = 0x8b51;
const FLOAT_VEC4 = 0x8b52;

const INT = 0x1404;
const INT_VEC2 = 0x8b53;
const INT_VEC3 = 0x8b54;
const INT_VEC4 = 0x8b55;

const UNSIGNED_INT = 0x1405;
const UNSIGNED_INT_VEC2 = 0x8dc6;
const UNSIGNED_INT_VEC3 = 0x8dc7;
const UNSIGNED_INT_VEC4 = 0x8dc8;

const BOOL = 0x8b56;
const BOOL_VEC2 = 0x8b57;
const BOOL_VEC3 = 0x8b58;
const BOOL_VEC4 = 0x8b59;

const FLOAT_MAT2 = 0x8b5a;
const FLOAT_MAT3 = 0x8b5b;
const FLOAT_MAT4 = 0x8b5c;

export const WEBGL_TO_ATTRIBUTE_TYPE = {
  [FLOAT]: "float",
  [FLOAT_VEC2]: "vec2",
  [FLOAT_VEC3]: "vec3",
  [FLOAT_VEC4]: "vec4",
  [INT]: "int",
  [INT_VEC2]: "ivec2",
  [INT_VEC3]: "ivec3",
  [INT_VEC4]: "ivec4",
  [UNSIGNED_INT]: "uint",
  [UNSIGNED_INT_VEC2]: "uvec2",
  [UNSIGNED_INT_VEC3]: "uvec3",
  [UNSIGNED_INT_VEC4]: "uvec4",
  [BOOL]: "bool",
  [BOOL_VEC2]: "bvec2",
  [BOOL_VEC3]: "bvec3",
  [BOOL_VEC4]: "bvec4",
  [FLOAT_MAT2]: "mat2",
  [FLOAT_MAT3]: "mat3",
  [FLOAT_MAT4]: "mat4",
} as const;

export type AttributeTypeMap = {
  float: Float32Array;
  vec2: Float32Array;
  vec3: Float32Array;
  vec4: Float32Array;

  int: number;
  ivec2: [number, number];
  ivec3: [number, number, number];
  ivec4: [number, number, number, number];

  uint: number;
  uvec2: [number, number];
  uvec3: [number, number, number];
  uvec4: [number, number, number, number];

  bool: boolean;
  bvec2: [boolean, boolean];
  bvec3: [boolean, boolean, boolean];
  bvec4: [boolean, boolean, boolean, boolean];

  mat2: [number, number, number, number];
  mat3: [number, number, number, number, number, number, number, number, number];
  mat4: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
};

export type AttributeTypeLabel = keyof AttributeTypeMap;
export type GetAttributeType<T extends AttributeTypeLabel> = AttributeTypeMap[T];

export const ATTRIBUTE_SETTERS = {
  [FLOAT]: floatAttribSetterGenerator(1),
  [FLOAT_VEC2]: floatAttribSetterGenerator(2),
  [FLOAT_VEC3]: floatAttribSetterGenerator(3),
  [FLOAT_VEC4]: floatAttribSetterGenerator(4),

  [INT]: intAttribSetterGenerator(1),
  [INT_VEC2]: intAttribSetterGenerator(2),
  [INT_VEC3]: intAttribSetterGenerator(3),
  [INT_VEC4]: intAttribSetterGenerator(4),
} as const;

export type BufferOptions = {
  buffer: WebGLBuffer;
  normalize?: boolean;
  stride?: number;
  offset?: number;
  divisor?: number;
};

function floatAttribSetterGenerator(size: number) {
  return function floatAttribSetterCreator(gl: WebGL2RenderingContext, index: number) {
    return function floatAttribSetter(value: BufferOptions) {
      gl.bindBuffer(ARRAY_BUFFER, value.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, size, FLOAT, value.normalize || false, value.stride || 0, value.offset || 0);

      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, value.divisor || 0);
      }
    };
  };
}

function intAttribSetterGenerator(size: number) {
  return function intAttribSetterCreator(gl: WebGL2RenderingContext, index: number) {
    return function intAttribSetter(value: BufferOptions) {
      gl.bindBuffer(ARRAY_BUFFER, value.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(index, size, INT, value.stride || 0, value.offset || 0);

      if (gl.vertexAttribDivisor) {
        gl.vertexAttribDivisor(index, value.divisor || 0);
      }
    };
  };
}
