import { Matrix } from "./matrix";
import { Material } from "./material";
import { Camera } from "./camera/camera-interface";
import { TextureManager } from "./texture-manager";

type Renderable = {
  material: Material<any, any>;
  render(camera: Camera): void;
};

export class Renderer {
  private readonly textureManager: TextureManager;

  constructor(gl: WebGL2RenderingContext) {
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.textureManager = new TextureManager(gl);
  }

  render(renderables: Renderable[], camera: Camera) {
    camera.updateProjectionMatrix();
    camera.inverseTransform.data = Matrix.inverse(camera.transform.data);

    for (const renderable of renderables) {
      renderable.material.use();
      this.textureManager.linkTexturesToUnits(renderable.material);
      renderable.render(camera);
    }
  }
}
