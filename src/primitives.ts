export function createQuad(width: number, height: number): Float32Array {
  return new Float32Array([0, 0, 0, height, width, 0, 0, height, width, 0, width, height]);
}
