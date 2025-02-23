export class QuadGeometry {
  public readonly vertices: Float32Array;

  constructor({ width, height }: { width: number; height: number }) {
    this.vertices = new Float32Array([0, 0, 0, height, width, 0, 0, height, width, 0, width, height]);
  }
}
