import Canvas from "./renderer";
import { BoxGeometry } from "./primitives";
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
    position: "vec3",
  },
  uniforms: {
    color: "vec4",
    modelMatrix: "mat4",
    projectionMatrix: "mat4",
    cameraInverseMatrix: "mat4",
  },
});

const box = new BoxGeometry({
  width: 1,
  height: 1,
  depth: 1,
});

const mesh = new Mesh({ material, geometry: box });

const camera = new PerspectiveCamera({
  aspect: window.innerHeight / window.innerWidth,
  fov: (45 * Math.PI) / 180,
  near: 0.1,
  far: 10,
});

camera.transform.translate(0, 0, -5);

function render() {
  canvas.clearScreen();
  mesh.render(camera);

  mesh.transform.rotateZ(0.02);
  mesh.transform.rotateX(0.01);
  camera.updateProjectionMatrix();
  material.uniforms.color.set([1, 0, 0, 1]);

  requestAnimationFrame(render);
}

render();
