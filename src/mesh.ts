import { Material } from "./material";
import { Transform } from "./transform";
import { Geometry } from "./primitives";
import { Camera } from "./camera/camera-interface";

type MeshMaterial = Material<
  {
    position: "vec3";
    texcoord: "vec2";
    normals: "vec3";
  },
  {
    projectionMatrix: "mat4";
    cameraInverseMatrix: "mat4";
    negativeLightDirection: "vec3";
    modelMatrix: "mat4";
  }
>;

export class Mesh {
  transform: Transform = new Transform();
  material: MeshMaterial;
  geometry: Geometry;

  constructor({ material, geometry }: { material: MeshMaterial; geometry: Geometry }) {
    this.material = material;
    this.geometry = geometry;
  }

  binded = false;

  public render(camera: Camera) {
    const gl = this.material.gl;

    const modelMatrix = this.transform.getMatrix().data;

    this.material.uniforms.modelMatrix.set(modelMatrix);
    this.material.uniforms.projectionMatrix.set(camera.projection.data);
    this.material.uniforms.cameraInverseMatrix.set(camera.inverseTransform.data);
    this.material.uniforms.negativeLightDirection.set([0, 0, -1]);

    if (this.binded === false) {
      this.material.attributes.texcoord.set({
        value: this.geometry.uvs,
        buffer: this.geometry.uvsBuffer,
      });

      this.material.attributes.position.set({
        value: this.geometry.positions,
        buffer: this.geometry.positionsBuffer,
      });

      this.material.attributes.normals.set({
        value: this.geometry.normals,
        buffer: this.geometry.normalsBuffer,
      });

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), gl.STATIC_DRAW);
      this.binded = true;
    }

    gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
