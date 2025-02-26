import { Matrix } from "./matrix";
import { Material } from "./material";
import { Geometry } from "./primitives";
import { Camera } from "./camera/camera-interface";

type MeshMaterial = Material<
  {
    position: "vec3";
    texcoord: "vec2";
  },
  {
    projectionMatrix: "mat4";
    cameraInverseMatrix: "mat4";
    modelMatrix: "mat4";
  }
>;

export class Mesh {
  translation = { x: 0, y: 0, z: 0 };
  rotation = { x: 0, y: 0, z: 0 };
  scale = { x: 1, y: 1, z: 1 };

  material: MeshMaterial;
  geometry: Geometry;

  constructor({ material, geometry }: { material: MeshMaterial; geometry: Geometry }) {
    this.material = material;
    this.geometry = geometry;
  }

  public render(camera: Camera) {
    const gl = this.material.gl;

    const modelMatrix = Matrix.fromTransform(
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

    this.material.uniforms.modelMatrix.set(modelMatrix);
    this.material.uniforms.projectionMatrix.set(camera.projection.data);
    this.material.uniforms.cameraInverseMatrix.set(Matrix.inverse(camera.transform.data));

    this.material.attributes.texcoord.set({
      value: this.geometry.uvs,
      buffer: this.geometry.uvsBuffer,
    });

    this.material.attributes.position.set({
      value: this.geometry.positions,
      buffer: this.geometry.positionsBuffer,
    });

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), gl.STATIC_DRAW);
    gl.drawElements(gl.TRIANGLES, this.geometry.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}
