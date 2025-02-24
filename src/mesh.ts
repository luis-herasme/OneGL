import { TransformMatrix } from "./matrix";
import { Material } from "./material";
import { Geometry } from "./primitives";
import { Camera } from "./perspective-camera";

type MeshMaterial = Material<
  { modelPosition: "vec3" },
  { cameraInverseTransform: "mat4"; cameraProjection: "mat4"; modelTransform: "mat4" }
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

    this.material.setAttribute("modelPosition", this.geometry.positions);
    this.material.setUniform("cameraProjection", camera.projection.data);
    this.material.setUniform("cameraInverseTransform", TransformMatrix.inverse(camera.transform.data));

    this.material.gl.drawArrays(this.material.gl.TRIANGLES, 0, this.geometry.positions.length / 3);
  }
}
