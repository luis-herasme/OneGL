import { TransformMatrix } from "./matrix";
import { Material } from "./material";
import { Geometry } from "./primitives";
import { Camera } from "./orthographic-camera";

type MeshMaterial = Material<
  {
    position: "vec3";
  },
  {
    projectionMatrix: "mat4";
    cameraInverseMatrix: "mat4";
    modelMatrix: "mat4";
  }
>;

export class Mesh {
  public transform: TransformMatrix = TransformMatrix.identity();
  public material: MeshMaterial;
  public geometry: Geometry;

  constructor({ material, geometry }: { material: MeshMaterial; geometry: Geometry }) {
    this.material = material;
    this.geometry = geometry;
  }

  public render(camera: Camera) {
    this.material.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    this.material.gl.useProgram(this.material.program);

    this.material.setAttribute("position", this.geometry.positions);
    this.material.setUniform("projectionMatrix", camera.projection.data);
    this.material.setUniform("cameraInverseMatrix", TransformMatrix.inverse(camera.transform.data));
    this.material.setUniform("modelMatrix", this.transform.data);

    this.material.gl.drawArrays(this.material.gl.TRIANGLES, 0, this.geometry.positions.length / 3);
  }
}
