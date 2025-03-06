import { Matrix } from "./matrix";

export class Transform {
  private translation = { x: 0, y: 0, z: 0 };
  private rotation = { x: 0, y: 0, z: 0 };
  private scale = { x: 1, y: 1, z: 1 };

  private needsUpdate = true;
  private matrix: Matrix = Matrix.identity();

  // Tranlsation
  translate(x: number, y: number, z: number): void {
    this.translation.x += x;
    this.translation.y += y;
    this.translation.z += z;
    this.needsUpdate = true;
  }

  setTranslation(x: number, y: number, z: number): void {
    this.translation = { x, y, z };
    this.needsUpdate = true;
  }

  getTranslation(): { x: number; y: number; z: number } {
    return {
      x: this.translation.x,
      y: this.translation.y,
      z: this.translation.z,
    };
  }

  // Rotation
  rotate(x: number, y: number, z: number): void {
    this.rotation.x += x;
    this.rotation.y += y;
    this.rotation.z += z;
    this.needsUpdate = true;
  }

  setRotation(x: number, y: number, z: number): void {
    this.rotation = { x, y, z };
    this.needsUpdate = true;
  }

  getRotation(): { x: number; y: number; z: number } {
    return {
      x: this.rotation.x,
      y: this.rotation.y,
      z: this.rotation.z,
    };
  }

  // Scale
  setScale(x: number, y: number, z: number): void {
    this.scale = { x, y, z };
    this.needsUpdate = true;
  }

  getScale(): { x: number; y: number; z: number } {
    return {
      x: this.scale.x,
      y: this.scale.y,
      z: this.scale.z,
    };
  }

  // Matrix
  getMatrix(): Matrix {
    if (this.needsUpdate) {
      this.matrix = Matrix.fromTransform(
        this.translation.x,
        this.translation.y,
        this.translation.z,
        this.rotation.x,
        this.rotation.y,
        this.rotation.z,
        this.scale.x,
        this.scale.y,
        this.scale.z
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
