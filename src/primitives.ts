export interface Geometry {
  positions: Float32Array;
}

export class QuadGeometry implements Geometry {
  public readonly positions: Float32Array;

  constructor({ width, height }: { width: number; height: number }) {
    // prettier-ignore
    this.positions = new Float32Array([
      -width / 2, -height / 2, 0,
       width / 2, -height / 2, 0,
       width / 2,  height / 2, 0,
       width / 2,  height / 2, 0,
      -width / 2,  height / 2, 0,
      -width / 2, -height / 2, 0
    ]);
  }
}

export class BoxGeometry implements Geometry {
  public readonly positions: Float32Array;

  constructor({ width, height, depth }: { width: number; height: number; depth: number }) {
    // prettier-ignore
    this.positions = new Float32Array([
      // Front face
      -width / 2, -height / 2,  depth / 2,
       width / 2, -height / 2,  depth / 2,
       width / 2,  height / 2,  depth / 2,
       width / 2,  height / 2,  depth / 2,
      -width / 2,  height / 2,  depth / 2,
      -width / 2, -height / 2,  depth / 2,

      // Back face
      -width / 2, -height / 2, -depth / 2,
      -width / 2,  height / 2, -depth / 2,
       width / 2,  height / 2, -depth / 2,
       width / 2,  height / 2, -depth / 2,
       width / 2, -height / 2, -depth / 2,
      -width / 2, -height / 2, -depth / 2,

      // Top face
      -width / 2,  height / 2, -depth / 2,
      -width / 2,  height / 2,  depth / 2,
       width / 2,  height / 2,  depth / 2,
       width / 2,  height / 2,  depth / 2,
       width / 2,  height / 2, -depth / 2,
      -width / 2,  height / 2, -depth / 2,

      // Bottom face
      -width / 2, -height / 2, -depth / 2,
       width / 2, -height / 2, -depth / 2,
       width / 2, -height / 2,  depth / 2,
       width / 2, -height / 2,  depth / 2,
      -width / 2, -height / 2,  depth / 2,
      -width / 2, -height / 2, -depth / 2,

      // Right face
       width / 2, -height / 2, -depth / 2,
       width / 2,  height / 2, -depth / 2,
       width / 2,  height / 2,  depth / 2,
       width / 2,  height / 2,  depth / 2,
       width / 2, -height / 2,  depth / 2,
       width / 2, -height / 2, -depth / 2,

      // Left face
      -width / 2, -height / 2, -depth / 2,
      -width / 2, -height / 2,  depth / 2,
      -width / 2,  height / 2,  depth / 2,
      -width / 2,  height / 2,  depth / 2,
      -width / 2,  height / 2, -depth / 2,
      -width / 2, -height / 2, -depth / 2,
    ]);
  }
}
