import { Matrix } from "../matrix";

export interface Camera {
  transform: Matrix;
  inverseTransform: Matrix;
  projection: Matrix;
  updateProjectionMatrix(): void;
}
