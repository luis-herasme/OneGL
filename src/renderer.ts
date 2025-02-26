import { Material } from "./material";
import { TextureManager } from "./texture";
import { Camera } from "./camera/camera-interface";

type Renderable = {
  material: Material<any, any>;
  render(camera: Camera): void;
};

export class Renderer {
  private readonly textureManager: TextureManager;

  constructor(gl: WebGL2RenderingContext) {
    this.textureManager = new TextureManager(gl);
  }

  render(renderables: Renderable[], camera: Camera) {
    for (const renderable of renderables) {
      renderable.material.use();
      this.textureManager.linkTexturesToUnits(renderable.material);
      renderable.render(camera);
    }
  }
}
