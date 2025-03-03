export function createWebGLProgram({
  gl,
  vertexSource,
  fragmentSource,
}: {
  gl: WebGL2RenderingContext;
  vertexSource: string;
  fragmentSource: string;
}): WebGLProgram {
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Failed to create program");
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);

    if (log === null) {
      throw new Error("Failed to link program: no log available");
    } else {
      throw new Error(`Failed to link program: ${log}`);
    }
  }

  return program;
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);

  if (!shader) {
    throw new Error("Failed to create shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);

    if (log === null) {
      throw new Error("Failed to compile shader: no log available");
    } else {
      throw new Error(`Failed to compile shader: ${log}`);
    }
  }

  return shader;
}
