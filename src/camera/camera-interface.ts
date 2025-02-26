import { Matrix } from "../matrix";

export interface Camera {
  transform: Matrix;
  projection: Matrix;
}
