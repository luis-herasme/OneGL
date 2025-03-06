import { Matrix } from "./matrix";

export class Transform {
  private translationData = { x: 0, y: 0, z: 0 };
  private rotationData = { x: 0, y: 0, z: 0 };
  private scaleData = { x: 1, y: 1, z: 1 };

  private needsUpdate = true;
  private matrix: Matrix = Matrix.identity();

  // Tranlsation
  translate(x: number, y: number, z: number): void {
    this.translationData.x += x;
    this.translationData.y += y;
    this.translationData.z += z;
    this.needsUpdate = true;
  }

  setTranslation(x: number, y: number, z: number): void {
    this.translationData = { x, y, z };
    this.needsUpdate = true;
  }

  getTranslation(): { x: number; y: number; z: number } {
    return {
      x: this.translationData.x,
      y: this.translationData.y,
      z: this.translationData.z,
    };
  }

  // Rotation
  rotate(x: number, y: number, z: number): void {
    this.rotationData.x += x;
    this.rotationData.y += y;
    this.rotationData.z += z;
    this.needsUpdate = true;
  }

  setRotation(x: number, y: number, z: number): void {
    this.rotationData = { x, y, z };
    this.needsUpdate = true;
  }

  getRotation(): { x: number; y: number; z: number } {
    return {
      x: this.rotationData.x,
      y: this.rotationData.y,
      z: this.rotationData.z,
    };
  }

  // Scale
  scale(x: number, y: number, z: number): void {
    this.scaleData.x *= x;
    this.scaleData.y *= y;
    this.scaleData.z *= z;
    this.needsUpdate = true;
  }

  setScale(x: number, y: number, z: number): void {
    this.scaleData = { x, y, z };
    this.needsUpdate = true;
  }

  getScale(): { x: number; y: number; z: number } {
    return {
      x: this.scaleData.x,
      y: this.scaleData.y,
      z: this.scaleData.z,
    };
  }

  // Matrix
  getMatrix(): Matrix {
    if (this.needsUpdate) {
      this.matrix = Matrix.fromTransform(
        this.translationData.x,
        this.translationData.y,
        this.translationData.z,
        this.rotationData.x,
        this.rotationData.y,
        this.rotationData.z,
        this.scaleData.x,
        this.scaleData.y,
        this.scaleData.z
      );

      this.needsUpdate = false;
    }

    return this.matrix;
  }

  setMatrix(matrix: Matrix): void {
    this.matrix = matrix;
    this.needsUpdate = false;
  }
}
