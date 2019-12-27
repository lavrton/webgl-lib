const vertex = `
attribute vec2 a_position;
uniform vec2 u_resolution;
uniform vec2 u_translation;

void main() {
  vec2 zeroToOne = (a_position + u_translation)  / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

const fragment = `
precision mediump float;
uniform vec4 u_color;
uniform float is_circle;

void main() {
  if (is_circle == 1.0) {
    float r = 0.0, delta = 0.0, alpha = 1.0;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    r = dot(cxy, cxy);
    if (r > 1.0) {
        discard;
    }
    gl_FragColor = u_color * (alpha);
  } else {
    gl_FragColor = u_color;
  }
}
`;

function createShader(gl: WebGLRenderingContext, type, source): WebGLShader {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader,
  fragmentShader
) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function resize(gl) {
  var realToCSSPixels = window.devicePixelRatio;

  // Lookup the size the browser is displaying the canvas in CSS pixels
  // and compute a size needed to make our drawingbuffer match it in
  // device pixels.
  var displayWidth = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  var displayHeight = Math.floor(gl.canvas.clientHeight * realToCSSPixels);

  // Check if the canvas is not the same size.
  if (gl.canvas.width !== displayWidth || gl.canvas.height !== displayHeight) {
    // Make the canvas the same size
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
  }
}

export default class Stage {
  children = [];
  gl: WebGLRenderingContext;
  translationLocation: any;
  colorUniformLocation: any;
  _waitingForDraw = false;
  constructor({ canvas }) {
    // setup context
    const gl = canvas.getContext('webgl') as WebGLRenderingContext;
    this.gl = gl;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    resize(gl);
    gl.viewport(
      0,
      -canvas.height,
      canvas.width * window.devicePixelRatio,
      canvas.height * 2
    );
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const positionAttibuteLocation = gl.getAttribLocation(
      program,
      'a_position'
    );
    var resolutionUniformLocation = gl.getUniformLocation(
      program,
      'u_resolution'
    );
    this.colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    this.translationLocation = gl.getUniformLocation(program, 'u_translation');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    gl.enableVertexAttribArray(positionAttibuteLocation);

    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
      positionAttibuteLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );
  }

  add(node) {
    this.children.push(node);
    node.parentElement = this;
    this.requestDraw();
  }

  draw() {
    this._clear();
    this.children.forEach(node => {
      node.draw(this);
    });
  }

  _clear() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  requestDraw() {
    if (this._waitingForDraw) {
      return;
    }
    this._waitingForDraw = true;
    requestAnimationFrame(() => {
      this._waitingForDraw = false;
      this.draw();
    });
  }
}
