export interface Geometry {
  // Data
  positions: Float32Array;
  indices: Uint16Array;
  uvs: Float32Array;

  // Buffers
  positionsBuffer: WebGLBuffer | null;
  indicesBuffer: WebGLBuffer | null;
  uvsBuffer: WebGLBuffer | null;
}

export class QuadGeometry implements Geometry {
  public readonly positions: Float32Array;
  public readonly indices: Uint16Array;
  public readonly uvs: Float32Array;

  public positionsBuffer: WebGLBuffer | null = null;
  public indicesBuffer: WebGLBuffer | null = null;
  public uvsBuffer: WebGLBuffer | null = null;

  constructor({ width, height }: { width: number; height: number }) {
    // prettier-ignore
    this.positions = new Float32Array([
      -width / 2, -height / 2, 0,  // bottom-left
       width / 2, -height / 2, 0,  // bottom-right
       width / 2,  height / 2, 0,  // top-right
      -width / 2,  height / 2, 0   // top-left
    ]);

    // prettier-ignore
    this.indices = new Uint16Array([
      0, 1, 2,  // first triangle (bottom-left, bottom-right, top-right)
      2, 3, 0   // second triangle (top-right, top-left, bottom-left)
    ]);

    // prettier-ignore
    this.uvs = new Float32Array([
      0, 0,  // bottom-left
      1, 0,  // bottom-right
      1, 1,  // top-right
      0, 1   // top-left
    ]);
  }
}

export class BoxGeometry implements Geometry {
  public readonly positions: Float32Array;
  public readonly indices: Uint16Array;
  public readonly uvs: Float32Array;

  public positionsBuffer: WebGLBuffer | null = null;
  public indicesBuffer: WebGLBuffer | null = null;
  public uvsBuffer: WebGLBuffer | null = null;

  constructor({ width, height, depth }: { width: number; height: number; depth: number }) {
    // prettier-ignore
    this.positions = new Float32Array([
      // Front face
      -width / 2, -height / 2,  depth / 2,  // 0
       width / 2, -height / 2,  depth / 2,  // 1
       width / 2,  height / 2,  depth / 2,  // 2
      -width / 2,  height / 2,  depth / 2,  // 3
      
      // Back face
      -width / 2, -height / 2, -depth / 2,  // 4
       width / 2, -height / 2, -depth / 2,  // 5
       width / 2,  height / 2, -depth / 2,  // 6
      -width / 2,  height / 2, -depth / 2,  // 7
      
      // Top face
      -width / 2,  height / 2,  depth / 2,  // 8
       width / 2,  height / 2,  depth / 2,  // 9
       width / 2,  height / 2, -depth / 2,  // 10
      -width / 2,  height / 2, -depth / 2,  // 11
      
      // Bottom face
      -width / 2, -height / 2,  depth / 2,  // 12
       width / 2, -height / 2,  depth / 2,  // 13
       width / 2, -height / 2, -depth / 2,  // 14
      -width / 2, -height / 2, -depth / 2,  // 15
      
      // Right face
       width / 2, -height / 2,  depth / 2,  // 16
       width / 2, -height / 2, -depth / 2,  // 17
       width / 2,  height / 2, -depth / 2,  // 18
       width / 2,  height / 2,  depth / 2,  // 19
      
      // Left face
      -width / 2, -height / 2, -depth / 2,  // 20
      -width / 2, -height / 2,  depth / 2,  // 21
      -width / 2,  height / 2,  depth / 2,  // 22
      -width / 2,  height / 2, -depth / 2   // 23
    ]);

    // Use indices to define the 12 triangles (6 faces, 2 triangles each)
    // prettier-ignore
    this.indices = new Uint16Array([
      0, 1, 2,    2, 3, 0,    // Front
      4, 5, 6,    6, 7, 4,    // Back
      8, 9, 10,   10, 11, 8,  // Top
      12, 13, 14, 14, 15, 12, // Bottom
      16, 17, 18, 18, 19, 16, // Right
      20, 21, 22, 22, 23, 20  // Left
    ]);

    // prettier-ignore
    this.uvs = new Float32Array([
      // Front face UVs
      0, 0,  1, 0,  1, 1,  0, 1,
      // Back face UVs
      0, 0,  1, 0,  1, 1,  0, 1,
      // Top face UVs
      0, 0,  1, 0,  1, 1,  0, 1,
      // Bottom face UVs
      0, 0,  1, 0,  1, 1,  0, 1,
      // Right face UVs
      0, 0,  1, 0,  1, 1,  0, 1,
      // Left face UVs
      0, 0,  1, 0,  1, 1,  0, 1
    ]);
  }
}
