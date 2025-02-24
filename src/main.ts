import Canvas from "./renderer";
import { QuadGeometry } from "./primitives";
import { vertexShader, fragmentShader } from "./shaders";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { PerspectiveCamera } from "./perspective-camera";

const canvas = new Canvas();

const material = new Material({
  gl: canvas.gl,
  shader: {
    vertex: vertexShader,
    fragment: fragmentShader,
  },
  attributes: {
    modelPosition: "vec3",
  },
  uniforms: {
    cameraInverseTransform: "mat4",
    cameraProjection: "mat4",
    modelTransform: "mat4",
    modelColor: "vec4",
  },
});

const quad = new QuadGeometry({
  width: 1,
  height: 1,
});

const mesh = new Mesh({ material, geometry: quad });

mesh.transform.translate(0, 0, 5);

const camera = new PerspectiveCamera({
  aspect: window.innerHeight / window.innerWidth,
  fov: (45 * Math.PI) / 180,
  near: 0.1,
  far: 10,
});

function render() {
  canvas.clearScreen();

  mesh.render(camera);
  material.setUniform("modelColor", [1, 0, 0, 1]);

  requestAnimationFrame(render);
}

render();
