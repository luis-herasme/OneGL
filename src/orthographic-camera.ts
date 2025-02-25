import { TransformMatrix } from "./matrix";

export interface Camera {
  transform: TransformMatrix;
  projection: TransformMatrix;
}

type OrthographicProjection = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
};

export class OrthographicCamera implements Camera {
  transform: TransformMatrix = TransformMatrix.identity();
  projection: TransformMatrix = TransformMatrix.zero();

  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;

  constructor(configuration: OrthographicProjection) {
    this.left = configuration.left;
    this.right = configuration.right;
    this.top = configuration.top;
    this.bottom = configuration.bottom;
    this.near = configuration.near;
    this.far = configuration.far;

    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    const { left, right, top, bottom, near, far } = this;

    // prettier-ignore
    this.projection = new TransformMatrix([
        2 / (right - left), 0, 0, 0,
        0, 2 / (top - bottom), 0, 0,
        0, 0, 2 / (near - far), 0,
        (left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1
    ]);
  }
}
