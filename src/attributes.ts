export type Attributes = Record<string, AttributeTypeLabel>;

export function getAttributes<A extends Attributes>({
  gl,
  program,
  attributes,
}: {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  attributes: A;
}): {
  locations: Record<keyof A, number>;
  setters: Record<keyof A, (value: GetAttributeType<A[keyof A]>, buffer: WebGLBuffer) => void>;
} {
  const locations = {} as Record<keyof A, number>;
  const setters = {} as Record<keyof A, (value: GetAttributeType<A[keyof A]>, buffer: WebGLBuffer) => void>;

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

    // Create a setter for the attribute
    const bufferSetter = getAttributeSetter(attribute.type)(gl, location);

    setters[attributeName] = (value: GetAttributeType<A[keyof A]>, buffer: WebGLBuffer) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, value, gl.STATIC_DRAW);
      bufferSetter({ buffer });
    };
  }

  return {
    locations,
    setters,
  };
}

enum WebGLAttributeType {
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

const WEBGL_TO_ATTRIBUTE_TYPE: Record<WebGLAttributeType, AttributeTypeLabel> = {
  [WebGLAttributeType.FLOAT]: "float",
  [WebGLAttributeType.FLOAT_VEC2]: "vec2",
  [WebGLAttributeType.FLOAT_VEC3]: "vec3",
  [WebGLAttributeType.FLOAT_VEC4]: "vec4",

  [WebGLAttributeType.INT]: "int",
  [WebGLAttributeType.INT_VEC2]: "ivec2",
  [WebGLAttributeType.INT_VEC3]: "ivec3",
  [WebGLAttributeType.INT_VEC4]: "ivec4",

  [WebGLAttributeType.UNSIGNED_INT]: "uint",
  [WebGLAttributeType.UNSIGNED_INT_VEC2]: "uvec2",
  [WebGLAttributeType.UNSIGNED_INT_VEC3]: "uvec3",
  [WebGLAttributeType.UNSIGNED_INT_VEC4]: "uvec4",

  [WebGLAttributeType.BOOL]: "bool",
  [WebGLAttributeType.BOOL_VEC2]: "bvec2",
  [WebGLAttributeType.BOOL_VEC3]: "bvec3",
  [WebGLAttributeType.BOOL_VEC4]: "bvec4",

  [WebGLAttributeType.FLOAT_MAT2]: "mat2",
  [WebGLAttributeType.FLOAT_MAT3]: "mat3",
  [WebGLAttributeType.FLOAT_MAT4]: "mat4",
} as const;

function getAttributeTypeLabel(type: number) {
  const webglType = WEBGL_TO_ATTRIBUTE_TYPE[type as keyof typeof WEBGL_TO_ATTRIBUTE_TYPE];

  if (!webglType) {
    throw new Error(`Unsupported attribute type: ${type}`);
  }

  return webglType;
}

type AttributeTypeMap = {
  float: Float32Array;
  vec2: Float32Array;
  vec3: Float32Array;
  vec4: Float32Array;

  int: Int32Array;
  ivec2: Int32Array;
  ivec3: Int32Array;
  ivec4: Int32Array;

  uint: Uint32Array;
  uvec2: Uint32Array;
  uvec3: Uint32Array;
  uvec4: Uint32Array;

  bool: Uint8Array;
  bvec2: Uint8Array;
  bvec3: Uint8Array;
  bvec4: Uint8Array;

  mat2: Float32Array;
  mat3: Float32Array;
  mat4: Float32Array;
};

type AttributeTypeLabel = keyof AttributeTypeMap;
export type GetAttributeType<T extends AttributeTypeLabel> = AttributeTypeMap[T];

const ATTRIBUTE_SETTERS = {
  [WebGLAttributeType.FLOAT]: floatAttribSetterGenerator(1),
  [WebGLAttributeType.FLOAT_VEC2]: floatAttribSetterGenerator(2),
  [WebGLAttributeType.FLOAT_VEC3]: floatAttribSetterGenerator(3),
  [WebGLAttributeType.FLOAT_VEC4]: floatAttribSetterGenerator(4),

  [WebGLAttributeType.INT]: intAttribSetterGenerator(1),
  [WebGLAttributeType.INT_VEC2]: intAttribSetterGenerator(2),
  [WebGLAttributeType.INT_VEC3]: intAttribSetterGenerator(3),
  [WebGLAttributeType.INT_VEC4]: intAttribSetterGenerator(4),
} as const;

function getAttributeSetter(type: number) {
  const setter = ATTRIBUTE_SETTERS[type as keyof typeof ATTRIBUTE_SETTERS];

  if (!setter) {
    throw new Error(`Unsupported attribute type: ${type}`);
  }

  return setter;
}

type BufferOptions = {
  buffer: WebGLBuffer;
  normalize?: boolean;
  stride?: number;
  offset?: number;
  divisor?: number;
};

function floatAttribSetterGenerator(size: number) {
  return function floatAttribSetterCreator(gl: WebGL2RenderingContext, index: number) {
    return function floatAttribSetter(value: BufferOptions) {
      gl.bindBuffer(gl.ARRAY_BUFFER, value.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, size, gl.FLOAT, value.normalize || false, value.stride || 0, value.offset || 0);
      gl.vertexAttribDivisor(index, value.divisor || 0);
    };
  };
}

function intAttribSetterGenerator(size: number) {
  return function intAttribSetterCreator(gl: WebGL2RenderingContext, index: number) {
    return function intAttribSetter(value: BufferOptions) {
      gl.bindBuffer(gl.ARRAY_BUFFER, value.buffer);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(index, size, gl.INT, value.stride || 0, value.offset || 0);
      gl.vertexAttribDivisor(index, value.divisor || 0);
    };
  };
}
