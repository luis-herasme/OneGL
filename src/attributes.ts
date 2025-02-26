export type AttributesDefinitions = Record<string, AttributeTypeLabel>;
export type Attributes<A extends AttributesDefinitions> = {
  [K in keyof A]: Attribute<GetAttributeType<A[K]>>;
};

class Attribute<T> {
  readonly gl: WebGL2RenderingContext;
  readonly name: string;
  readonly type: AttributeTypeLabel;
  readonly program: WebGLProgram;
  readonly location: number;
  set: (value: BufferOptions<T>) => void;

  constructor(gl: WebGL2RenderingContext, name: string, type: AttributeTypeLabel, program: WebGLProgram) {
    this.gl = gl;
    this.name = name;
    this.type = type;
    this.program = program;

    this.location = this.getLocation();
    this.validateAttributeCompatibility();
    this.set = getAttributeSetter(this.type)(this.gl, this.location);
  }

  private getLocation() {
    const location = this.gl.getAttribLocation(this.program, this.name);

    if (location === -1) {
      throw new Error(`Failed to get attribute location: ${this.name}`);
    }

    return location;
  }

  private validateAttributeCompatibility() {
    const attribute = this.gl.getActiveAttrib(this.program, this.location);

    if (!attribute) {
      throw new Error(`Failed to get attribute data: ${this.name}`);
    }

    const type = getAttributeTypeLabel(attribute.type);

    if (type !== this.type) {
      throw new Error(`Attribute type mismatch: ${this.type} !== ${type}. For attribute: ${this.name}`);
    }
  }
}

export function getAttributes<A extends AttributesDefinitions>({
  gl,
  program,
  attributes,
}: {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  attributes: A;
}): Attributes<A> {
  const attributesMap = {} as Record<string, Attribute<any>>;

  for (const [name, type] of Object.entries(attributes)) {
    attributesMap[name] = new Attribute(gl, name, type, program);
  }

  return attributesMap as Attributes<A>;
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
  float: floatAttribSetterGenerator(1),
  vec2: floatAttribSetterGenerator(2),
  vec3: floatAttribSetterGenerator(3),
  vec4: floatAttribSetterGenerator(4),

  int: intAttribSetterGenerator(1),
  ivec2: intAttribSetterGenerator(2),
  ivec3: intAttribSetterGenerator(3),
  ivec4: intAttribSetterGenerator(4),
} as const;

function getAttributeSetter(type: string) {
  const setter = ATTRIBUTE_SETTERS[type as keyof typeof ATTRIBUTE_SETTERS];

  if (!setter) {
    throw new Error(`Unsupported attribute type: ${type}`);
  }

  return setter;
}

type BufferOptions<T> = {
  buffer: WebGLBuffer;
  normalize?: boolean;
  stride?: number;
  offset?: number;
  divisor?: number;
  value: T;
};

function floatAttribSetterGenerator(size: number) {
  return function floatAttribSetterCreator(gl: WebGL2RenderingContext, index: number) {
    return function floatAttribSetter(value: BufferOptions<any>) {
      gl.bindBuffer(gl.ARRAY_BUFFER, value.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, value.value, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribPointer(index, size, gl.FLOAT, value.normalize || false, value.stride || 0, value.offset || 0);
      gl.vertexAttribDivisor(index, value.divisor || 0);
    };
  };
}

function intAttribSetterGenerator(size: number) {
  return function intAttribSetterCreator(gl: WebGL2RenderingContext, index: number) {
    return function intAttribSetter(value: BufferOptions<any>) {
      gl.bindBuffer(gl.ARRAY_BUFFER, value.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, value.value, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(index);
      gl.vertexAttribIPointer(index, size, gl.INT, value.stride || 0, value.offset || 0);
      gl.vertexAttribDivisor(index, value.divisor || 0);
    };
  };
}
