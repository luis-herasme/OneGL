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

export type UniformTypeMap = {
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

export type GetUniformType<T extends UniformTypeLabel> = UniformTypeMap[T];
export type UniformTypeLabel = keyof UniformTypeMap;

export const WEBGL_TO_UNIFORM_TYPE = {
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

export const UNIFORM_SETTERS = {
  [FLOAT]: floatSetter,
  [FLOAT_VEC2]: floatVec2Setter,
  [FLOAT_VEC3]: floatVec3Setter,
  [FLOAT_VEC4]: floatVec4Setter,

  [INT]: intSetter,
  [INT_VEC2]: intVec2Setter,
  [INT_VEC3]: intVec3Setter,
  [INT_VEC4]: intVec4Setter,

  [UNSIGNED_INT]: uintSetter,
  [UNSIGNED_INT_VEC2]: uintVec2Setter,
  [UNSIGNED_INT_VEC3]: uintVec3Setter,
  [UNSIGNED_INT_VEC4]: uintVec4Setter,

  [BOOL]: intSetter,
  [BOOL_VEC2]: intVec2Setter,
  [BOOL_VEC3]: intVec3Setter,
  [BOOL_VEC4]: intVec4Setter,

  [FLOAT_MAT2]: floatMat2Setter,
  [FLOAT_MAT3]: floatMat3Setter,
  [FLOAT_MAT4]: floatMat4Setter,
} as const;

function floatSetter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: number) {
    gl.uniform1f(location, v);
  };
}

function floatVec2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform2fv(location, v);
  };
}

function floatVec3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform3fv(location, v);
  };
}

function floatVec4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform4fv(location, v);
  };
}

function intSetter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: number) {
    gl.uniform1i(location, v);
  };
}

function intVec2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform2iv(location, v);
  };
}

function intVec3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform3iv(location, v);
  };
}

function intVec4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform4iv(location, v);
  };
}

function uintSetter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: number) {
    gl.uniform1ui(location, v);
  };
}

function uintVec2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform2uiv(location, v);
  };
}

function uintVec3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform3uiv(location, v);
  };
}

function uintVec4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniform4uiv(location, v);
  };
}

function floatMat2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniformMatrix2fv(location, false, v);
  };
}

function floatMat3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniformMatrix3fv(location, false, v);
  };
}

function floatMat4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: Iterable<number>) {
    gl.uniformMatrix4fv(location, false, v);
  };
}
