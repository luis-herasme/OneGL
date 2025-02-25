export type Uniforms = Record<string, UniformTypeLabel>;

export function getUniforms<U extends Uniforms>({
  gl,
  program,
  uniforms,
}: {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  uniforms: U;
}): {
  locations: Record<keyof U, WebGLUniformLocation>;
  setters: Record<keyof U, (value: GetUniformType<U[keyof U]>) => void>;
} {
  const locations = {} as Record<keyof U, WebGLUniformLocation>;
  const setters = {} as Record<keyof U, (value: GetUniformType<U[keyof U]>) => void>;

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
  if (uniformsNotFound.size > 0) {
    throw new Error(`Missing uniforms: ${Array.from(uniformsNotFound).join(", ")}`);
  }

  return {
    locations,
    setters,
  };
}

type UniformTypeLabel = keyof UniformTypeMap;
export type GetUniformType<T extends UniformTypeLabel> = UniformTypeMap[T];

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

const UNIFORM_SETTERS = {
  [WebGLUniformType.FLOAT]: floatSetter,
  [WebGLUniformType.FLOAT_VEC2]: floatVec2Setter,
  [WebGLUniformType.FLOAT_VEC3]: floatVec3Setter,
  [WebGLUniformType.FLOAT_VEC4]: floatVec4Setter,

  [WebGLUniformType.INT]: intSetter,
  [WebGLUniformType.INT_VEC2]: intVec2Setter,
  [WebGLUniformType.INT_VEC3]: intVec3Setter,
  [WebGLUniformType.INT_VEC4]: intVec4Setter,

  [WebGLUniformType.UNSIGNED_INT]: uintSetter,
  [WebGLUniformType.UNSIGNED_INT_VEC2]: uintVec2Setter,
  [WebGLUniformType.UNSIGNED_INT_VEC3]: uintVec3Setter,
  [WebGLUniformType.UNSIGNED_INT_VEC4]: uintVec4Setter,

  [WebGLUniformType.BOOL]: boolSetter,
  [WebGLUniformType.BOOL_VEC2]: boolVec2Setter,
  [WebGLUniformType.BOOL_VEC3]: boolVec3Setter,
  [WebGLUniformType.BOOL_VEC4]: boolVec4Setter,

  [WebGLUniformType.FLOAT_MAT2]: floatMat2Setter,
  [WebGLUniformType.FLOAT_MAT3]: floatMat3Setter,
  [WebGLUniformType.FLOAT_MAT4]: floatMat4Setter,
} as const;

const WEBGL_TO_UNIFORM_TYPE: Record<WebGLUniformType, UniformTypeLabel> = {
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

function getUniformTypeLabel(type: number) {
  const webglType = WEBGL_TO_UNIFORM_TYPE[type as keyof typeof WEBGL_TO_UNIFORM_TYPE];

  if (!webglType) {
    throw new Error(`Unsupported uniform type: ${type}`);
  }

  return webglType;
}

function getUniformSetter(type: number) {
  const setter = UNIFORM_SETTERS[type as keyof typeof UNIFORM_SETTERS];

  if (!setter) {
    throw new Error(`Unsupported uniform type: ${type}`);
  }

  return setter;
}

function floatSetter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: number) {
    gl.uniform1f(location, v);
  };
}

function floatVec2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number]) {
    gl.uniform2fv(location, v);
  };
}

function floatVec3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number]) {
    gl.uniform3fv(location, v);
  };
}

function floatVec4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number, number]) {
    gl.uniform4fv(location, v);
  };
}

function intSetter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: number) {
    gl.uniform1i(location, v);
  };
}

function boolSetter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: boolean) {
    gl.uniform1i(location, v as unknown as number);
  };
}

function boolVec2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [boolean, boolean]) {
    gl.uniform2iv(location, v as unknown as [number, number]);
  };
}

function boolVec3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [boolean, boolean, boolean]) {
    gl.uniform3iv(location, v as unknown as [number, number, number]);
  };
}

function boolVec4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [boolean, boolean, boolean, boolean]) {
    gl.uniform4iv(location, v as unknown as [number, number, number, number]);
  };
}

function intVec2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number]) {
    gl.uniform2iv(location, v);
  };
}

function intVec3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number]) {
    gl.uniform3iv(location, v);
  };
}

function intVec4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number, number]) {
    gl.uniform4iv(location, v);
  };
}

function uintSetter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: number) {
    gl.uniform1ui(location, v);
  };
}

function uintVec2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number]) {
    gl.uniform2uiv(location, v);
  };
}

function uintVec3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number]) {
    gl.uniform3uiv(location, v);
  };
}

function uintVec4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number, number]) {
    gl.uniform4uiv(location, v);
  };
}

function floatMat2Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number, number]) {
    gl.uniformMatrix2fv(location, false, v);
  };
}

function floatMat3Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (v: [number, number, number, number, number, number, number, number, number]) {
    gl.uniformMatrix3fv(location, false, v);
  };
}

function floatMat4Setter(gl: WebGL2RenderingContext, location: WebGLUniformLocation) {
  return function (
    v: [
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
    ]
  ) {
    gl.uniformMatrix4fv(location, false, v);
  };
}
