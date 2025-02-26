import { Texture } from "./texture";
import { Material } from "./material";

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
