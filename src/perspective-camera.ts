import { TransformMatrix } from "./matrix";

export interface Camera {
  transform: TransformMatrix;
  projection: TransformMatrix;
}

type PerspectiveProjection = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
};

export class PerspectiveCamera implements Camera {
  transform: TransformMatrix = TransformMatrix.identity();
  projection: TransformMatrix = TransformMatrix.zero();

  fov: number;
  aspect: number;
  near: number;
  far: number;

  constructor({ fov, aspect, near, far }: PerspectiveProjection) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    this.projection = TransformMatrix.zero();

    const f = 1.0 / Math.tan(this.fov / 2);
    const zFactor = this.far / (this.far - this.near);

    this.projection.data[0 + 0 * 4] = this.aspect * f;
    this.projection.data[1 + 1 * 4] = f;
    this.projection.data[2 + 2 * 4] = zFactor;
    this.projection.data[2 + 3 * 4] = -this.near * zFactor;
    this.projection.data[3 + 2 * 4] = 1;
  }
}
