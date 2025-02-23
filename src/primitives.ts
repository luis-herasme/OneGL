export interface Geometry {
  positions: Float32Array;
}

export class QuadGeometry implements Geometry {
  public readonly positions: Float32Array;

  constructor({ width, height }: { width: number; height: number }) {
    this.positions = new Float32Array([
      -width / 2,
      -height / 2,
      -width / 2,
      height / 2,
      width / 2,
      -height / 2,
      -width / 2,
      height / 2,
      width / 2,
      -height / 2,
      width / 2,
      height / 2,
    ]);
  }
}
