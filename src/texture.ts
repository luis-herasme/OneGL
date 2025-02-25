export class Texture {
  readonly gl: WebGL2RenderingContext;
  readonly image: HTMLImageElement;
  readonly texture: WebGLTexture;

  private constructor(gl: WebGL2RenderingContext, image: HTMLImageElement, texture: WebGLTexture) {
    this.gl = gl;
    this.image = image;
    this.texture = texture;
  }

  static async load({ gl, src }: { gl: WebGL2RenderingContext; src: string }) {
    const image = await loadImage(src);
    gl.enable(gl.DEPTH_TEST);

    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, image.width, image.height, 0, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    return new Texture(gl, image, texture);
  }
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}
