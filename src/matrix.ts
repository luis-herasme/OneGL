type MatrixData = [number, number, number, number, number, number, number, number, number];

export class Matrix {
  data: MatrixData;

  constructor(data: MatrixData = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
    this.data = data;
  }

  rotate(angleInRadians: number): void {
    this.data = Matrix.rotate(this.data, angleInRadians);
  }

  scale(sx: number, sy: number): void {
    this.data = Matrix.scale(this.data, sx, sy);
  }

  translate(tx: number, ty: number): void {
    this.data = Matrix.translate(this.data, tx, ty);
  }

  static identity(): MatrixData {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  }

  static projection(width: number, height: number): MatrixData {
    return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
  }

  static translation(tx: number, ty: number): MatrixData {
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  }

  static rotation(angleInRadians: number): MatrixData {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return [c, -s, 0, s, c, 0, 0, 0, 1];
  }

  static scaling(sx: number, sy: number): MatrixData {
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  }

  static multiply(a: MatrixData, b: MatrixData): MatrixData {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];

    const a10 = a[3];
    const a11 = a[4];
    const a12 = a[5];

    const a20 = a[6];
    const a21 = a[7];
    const a22 = a[8];

    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];

    const b10 = b[3];
    const b11 = b[4];
    const b12 = b[5];

    const b20 = b[6];
    const b21 = b[7];
    const b22 = b[8];

    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  }

  static translate(m: MatrixData, tx: number, ty: number): MatrixData {
    return Matrix.multiply(m, Matrix.translation(tx, ty));
  }

  static rotate(m: MatrixData, angleInRadians: number): MatrixData {
    return Matrix.multiply(m, Matrix.rotation(angleInRadians));
  }

  static scale(m: MatrixData, sx: number, sy: number): MatrixData {
    return Matrix.multiply(m, Matrix.scaling(sx, sy));
  }
}
