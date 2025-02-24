// prettier-ignore
type MatrixData = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
];

export class TransformMatrix {
  data: MatrixData;

  constructor(data: MatrixData) {
    this.data = data;
  }

  rotateX(radians: number): void {
    this.data = TransformMatrix.multiply(this.data, TransformMatrix.rotateX(radians));
  }

  rotateY(radians: number): void {
    this.data = TransformMatrix.multiply(this.data, TransformMatrix.rotateY(radians));
  }

  rotateZ(radians: number): void {
    this.data = TransformMatrix.multiply(this.data, TransformMatrix.rotateZ(radians));
  }

  scale(x: number, y: number, z: number): void {
    this.data = TransformMatrix.multiply(this.data, TransformMatrix.scale(x, y, z));
  }

  translate(x: number, y: number, z: number): void {
    this.data = TransformMatrix.multiply(this.data, TransformMatrix.translation(x, y, z));
  }

  static identity(): TransformMatrix {
    // prettier-ignore
    return new TransformMatrix([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  static zero(): TransformMatrix {
    // prettier-ignore
    return new TransformMatrix([
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0
    ]);
  }

  static translation(x: number, y: number, z: number): MatrixData {
    // prettier-ignore
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ];
  }

  static multiply(a: MatrixData, b: MatrixData): MatrixData {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];

    const b00 = b[0];
    const b01 = b[1];
    const b02 = b[2];
    const b03 = b[3];
    const b10 = b[4];
    const b11 = b[5];
    const b12 = b[6];
    const b13 = b[7];
    const b20 = b[8];
    const b21 = b[9];
    const b22 = b[10];
    const b23 = b[11];
    const b30 = b[12];
    const b31 = b[13];
    const b32 = b[14];
    const b33 = b[15];

    // prettier-ignore
    return [
      a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
      a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
      a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
      a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,

      a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
      a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
      a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
      a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,

      a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
      a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
      a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
      a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,

      a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
      a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
      a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
      a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33
    ];
  }

  static rotateX(radians: number): MatrixData {
    const c = Math.cos(radians);
    const s = Math.sin(radians);

    // prettier-ignore
    return [
      1,  0, 0, 0,
      0,  c, s, 0,
      0, -s, c, 0,
      0,  0, 0, 1
    ];
  }

  static rotateY(radians: number): MatrixData {
    const c = Math.cos(radians);
    const s = Math.sin(radians);

    // prettier-ignore
    return [
      c, 0, -s, 0,
      0, 1,  0, 0,
      s, 0,  c, 0,
      0, 0,  0, 1
    ];
  }

  static rotateZ(radians: number): MatrixData {
    const c = Math.cos(radians);
    const s = Math.sin(radians);

    // prettier-ignore
    return [
       c, s, 0, 0,
      -s, c, 0, 0,
       0, 0, 1, 0,
       0, 0, 0, 1
    ];
  }

  static scale(x: number, y: number, z: number): MatrixData {
    // prettier-ignore
    return [
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ];
  }

  static inverse(m: MatrixData): MatrixData {
    const m00 = m[0];
    const m01 = m[1];
    const m02 = m[2];
    const m03 = m[3];
    const m10 = m[4];
    const m11 = m[5];
    const m12 = m[6];
    const m13 = m[7];
    const m20 = m[8];
    const m21 = m[9];
    const m22 = m[10];
    const m23 = m[11];
    const m30 = m[12];
    const m31 = m[13];
    const m32 = m[14];
    const m33 = m[15];

    const b00 = m00 * m11 - m01 * m10;
    const b01 = m00 * m12 - m02 * m10;
    const b02 = m00 * m13 - m03 * m10;
    const b03 = m01 * m12 - m02 * m11;
    const b04 = m01 * m13 - m03 * m11;
    const b05 = m02 * m13 - m03 * m12;
    const b06 = m20 * m31 - m21 * m30;
    const b07 = m20 * m32 - m22 * m30;
    const b08 = m20 * m33 - m23 * m30;
    const b09 = m21 * m32 - m22 * m31;
    const b10 = m21 * m33 - m23 * m31;
    const b11 = m22 * m33 - m23 * m32;

    const det = 1 / (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

    // prettier-ignore
    return [
      (m11 * b11 - m12 * b10 + m13 * b09) * det,
      (m02 * b10 - m01 * b11 - m03 * b09) * det,
      (m31 * b05 - m32 * b04 + m33 * b03) * det,
      (m22 * b04 - m21 * b05 - m23 * b03) * det,

      (m12 * b08 - m10 * b11 - m13 * b07) * det,
      (m00 * b11 - m02 * b08 + m03 * b07) * det,
      (m32 * b02 - m30 * b05 - m33 * b01) * det,
      (m20 * b05 - m22 * b02 + m23 * b01) * det,

      (m10 * b10 - m11 * b08 + m13 * b06) * det,
      (m01 * b08 - m00 * b10 - m03 * b06) * det,
      (m30 * b04 - m31 * b02 + m33 * b00) * det,
      (m21 * b02 - m20 * b04 - m23 * b00) * det,

      (m11 * b07 - m10 * b09 - m12 * b06) * det,
      (m00 * b09 - m01 * b07 + m02 * b06) * det,
      (m31 * b01 - m30 * b03 - m32 * b00) * det,
      (m20 * b03 - m21 * b01 + m22 * b00) * det
    ];
  }
}
