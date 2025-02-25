import Canvas from "./renderer";
import { BoxGeometry } from "./primitives";
import { vertexShader, fragmentShader } from "./shaders";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { PerspectiveCamera } from "./perspective-camera";
import { Texture } from "./texture";

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
    uSampler: "sampler2D",
  },
});

const texture = await Texture.load({ gl: canvas.gl, src: "/t1.jpeg" });

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
material.gl.useProgram(material.program);
material.uniforms.uSampler.set(texture);

function render() {
  canvas.clearScreen();
  mesh.render(camera);

  mesh.transform.rotateZ(0.002);
  mesh.transform.rotateX(0.001);
  camera.updateProjectionMatrix();

  requestAnimationFrame(render);
}

render();
