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
    const gl = this.material.gl;

    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    gl.useProgram(this.material.program);

    this.material.setUniform("projectionMatrix", camera.projection.data);
    this.material.setUniform("cameraInverseMatrix", TransformMatrix.inverse(camera.transform.data));
    this.material.setUniform("modelMatrix", this.transform.data);

    if (this.geometry.positionsBuffer == null) {
      this.geometry.positionsBuffer = gl.createBuffer();
    }

    this.material.setAttribute("position", this.geometry.positions, this.geometry.positionsBuffer);

    if (this.geometry.indicesBuffer == null) {
      this.geometry.indicesBuffer = gl.createBuffer();
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
