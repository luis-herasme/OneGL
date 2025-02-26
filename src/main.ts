import Canvas from "./renderer";
import { BoxGeometry } from "./primitives";
import { vertexShader, fragmentShader } from "./shaders";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { PerspectiveCamera } from "./camera/perspective-camera";
import { Renderer, Texture } from "./texture";

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
  },
  uniforms: {
    modelMatrix: "mat4",
    projectionMatrix: "mat4",
    cameraInverseMatrix: "mat4",
    modelTexture: "sampler2D",
  },
});

const texture = await Texture.load({ gl: canvas.gl, src: "/t1.jpeg" });

const box = new BoxGeometry({
  width: 1,
  height: 1,
  depth: 1,
});

const camera = new PerspectiveCamera({
  aspect: window.innerHeight / window.innerWidth,
  fov: (45 * Math.PI) / 180,
  near: 0.1,
  far: 100,
});

material.uniforms.modelTexture.set(texture);

const meshes: Mesh[] = [];

const renderer = new Renderer(canvas.gl);
for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    const mesh = new Mesh({ material, geometry: box });
    mesh.translation = { x: 5 - x, y: 5 - y, z: 15 };
    mesh.scale = { x: 0.5, y: 0.5, z: 0.5 };
    meshes.push(mesh);
  }
}

function render() {
  canvas.clearScreen();

  for (const mesh of meshes) {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    renderer.render(mesh, camera);
  }

  camera.updateProjectionMatrix();

  requestAnimationFrame(render);
}

render();
