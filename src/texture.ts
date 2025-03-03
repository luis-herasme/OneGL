import { loadImage } from "./utils/load-image";

export class Texture {
  readonly image: HTMLImageElement;
  readonly texture: WebGLTexture;

  private constructor(image: HTMLImageElement, texture: WebGLTexture) {
    this.image = image;
    this.texture = texture;
  }

  static async load({ gl, src }: { gl: WebGL2RenderingContext; src: string }) {
    const image = await loadImage(src);
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    return new Texture(image, texture);
  }
}
