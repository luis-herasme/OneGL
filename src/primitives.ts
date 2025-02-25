export interface Geometry {
  positions: Float32Array;
  indices: Uint16Array;
  positionsBuffer: WebGLBuffer | null;
  indicesBuffer: WebGLBuffer | null;
}

export class QuadGeometry implements Geometry {
  public readonly positions: Float32Array;
  public readonly indices: Uint16Array;

  public positionsBuffer: WebGLBuffer | null = null;
  public indicesBuffer: WebGLBuffer | null = null;

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
  }
}

export class BoxGeometry implements Geometry {
  public readonly positions: Float32Array;
  public readonly indices: Uint16Array;

  public positionsBuffer: WebGLBuffer | null = null;
  public indicesBuffer: WebGLBuffer | null = null;

  constructor({ width, height, depth }: { width: number; height: number; depth: number }) {
    // prettier-ignore
    this.positions = new Float32Array([
      // Front face vertices
      -width / 2, -height / 2,  depth / 2,  // 0: front-bottom-left
       width / 2, -height / 2,  depth / 2,  // 1: front-bottom-right
       width / 2,  height / 2,  depth / 2,  // 2: front-top-right
      -width / 2,  height / 2,  depth / 2,  // 3: front-top-left
      
      // Back face vertices
      -width / 2, -height / 2, -depth / 2,  // 4: back-bottom-left
       width / 2, -height / 2, -depth / 2,  // 5: back-bottom-right
       width / 2,  height / 2, -depth / 2,  // 6: back-top-right
      -width / 2,  height / 2, -depth / 2   // 7: back-top-left
    ]);

    // Use indices to define the 12 triangles (6 faces, 2 triangles each)
    // prettier-ignore
    this.indices = new Uint16Array([
      // Front face
      0, 1, 2,
      2, 3, 0,
      
      // Back face
      4, 7, 6,
      6, 5, 4,
      
      // Top face
      7, 3, 2,
      2, 6, 7,
      
      // Bottom face
      4, 5, 1,
      1, 0, 4,
      
      // Right face
      5, 6, 2,
      2, 1, 5,
      
      // Left face
      4, 0, 3,
      3, 7, 4
    ]);
  }
}
