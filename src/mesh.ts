import { Matrix } from "./matrix";
import { Material } from "./program";
import { Geometry } from "./primitives";

type MeshMaterial = Material<{ aPosition: "vec2" }, { uProjection: "mat3"; uTransform: "mat3" }>;

export class Mesh {
  public material: MeshMaterial;
  public geometry: Geometry;
  public transform: Matrix;

  constructor({ material, geometry }: { material: MeshMaterial; geometry: Geometry }) {
    this.material = material;
    this.geometry = geometry;
    this.transform = new Matrix();
  }

  public render() {
    this.material.gl.useProgram(this.material.program);

    this.material.setAttribute("aPosition", this.geometry.positions);
    this.material.setUniform("uProjection", Matrix.projection(window.innerWidth, window.innerHeight));
    this.material.setUniform("uTransform", this.transform.data);

    this.material.gl.drawArrays(this.material.gl.TRIANGLES, 0, 6);
  }
}
