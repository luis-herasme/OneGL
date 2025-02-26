import { Material } from "./material";

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

export class TextureManager {
  private readonly gl: WebGL2RenderingContext;
  private readonly maxTextureUnits: number = 16;
  private readonly bindedTextures: Array<Texture | undefined> = [];

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  linkTexturesToUnits(material: Material<any, any>) {
    for (let i = 0; i < material.textures.length; i++) {
      const texture = material.textures[i]!;
      let unit = this.findBoundTextureUnit(texture.texture);

      if (unit !== null) {
        continue;
      }

      if (unit === null) {
        unit = this.findAvailableTextureUnit();
      }

      if (unit === null) {
        unit = this.freeTextureUnit(material);
      }

      this.bindTexture(texture.texture, unit);
      this.gl.uniform1i(texture.uniformLocation, unit);
    }
  }

  private findBoundTextureUnit(texture: Texture): number | null {
    for (let i = 0; i < this.maxTextureUnits; i++) {
      const bindedTexture = this.bindedTextures[i];

      if (bindedTexture && bindedTexture === texture) {
        return i;
      }
    }

    return null;
  }

  private findAvailableTextureUnit(): number | null {
    for (let i = 0; i < this.maxTextureUnits; i++) {
      if (this.bindedTextures[i] === undefined) {
        return i;
      }
    }

    return null;
  }

  private freeTextureUnit(material: Material): number {
    for (let i = 0; i < this.maxTextureUnits; i++) {
      const bindedTexture = this.bindedTextures[i]!;

      let required = false;
      for (let j = 0; j < material.textures.length; j++) {
        if (material.textures[j]!.texture === bindedTexture) {
          required = true;
          break;
        }
      }

      if (required === false) {
        return i;
      }
    }

    throw new Error("No free texture units");
  }

  private bindTexture(texture: Texture, unit: number) {
    this.gl.activeTexture(this.gl.TEXTURE0 + unit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);
    this.bindedTextures[unit] = texture;
  }
}
