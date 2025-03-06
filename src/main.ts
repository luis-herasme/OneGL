import Canvas from "./canvas";
import { BoxGeometry } from "./primitives";
import { vertexShader, fragmentShader } from "./shaders";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { PerspectiveCamera } from "./camera/perspective-camera";
import { Texture } from "./texture";
import { Renderer } from "./renderer";
import { FPSMeter } from "./fps-meter";

const canvas = new Canvas();

const material = new Material({
  gl: canvas.gl,
  shader: {
    vertex: vertexShader,
    fragment: fragmentShader,
  },
  attributes: {
    position: "vec3",
    texcoord: "vec2",
    normals: "vec3",
  },
  uniforms: {
    modelMatrix: "mat4",
    projectionMatrix: "mat4",
    cameraInverseMatrix: "mat4",
    negativeLightDirection: "vec3",
    modelTexture: "sampler2D",
  },
});

const texture = await Texture.load({
  gl: canvas.gl,
  src: "/i.png",
  type: "RGBA",
});

material.uniforms.modelTexture.set(texture);

const box = new BoxGeometry({
  gl: canvas.gl,
  width: 1,
  height: 1,
  depth: 1,
});

const renderer = new Renderer(canvas.gl);

const camera = new PerspectiveCamera({
  aspect: window.innerHeight / window.innerWidth,
  fov: (45 * Math.PI) / 180,
  near: 0.1,
  far: 100,
});

const meshes: Mesh[] = [];

const SIZE = 6;

for (let x = 0; x < SIZE; x++) {
  for (let y = 0; y < SIZE; y++) {
    for (let z = 0; z < SIZE; z++) {
      const mesh = new Mesh({ material, geometry: box });
      mesh.transform.setTranslation(SIZE / 2 - x, SIZE / 2 - y, SIZE + z);
      mesh.transform.setScale(0.5, 0.5, 0.5);
      meshes.push(mesh);
    }
  }
}

const fps = new FPSMeter();

function render() {
  fps.update();
  canvas.clearScreen();
  camera.transform.rotateZ(0.01);

  for (const mesh of meshes) {
    mesh.transform.rotate(0.01, 0.02, 0);
  }

  renderer.render(meshes, camera);

  requestAnimationFrame(render);
}

render();
