import Stage from './stage';
import { colorToRGBA } from './colors';

const EDGES = 8;

export default class Ellipse {
  parentElement: any;
  _attrs: any = {};

  _rgba = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  };
  _shape = new Float32Array(EDGES * 3 * 2);
  _dirtyShape = true;
  _transform = new Float32Array(2);
  _dirtyTransform = true;
  [index: string]: any;
  constructor(attributes) {
    Object.assign(this, attributes);
  }

  get x(): number {
    return this._attrs.x || 0;
  }

  set x(val: number) {
    this._attrs.x = val;
    this._dirtyTransform = true;
    this._requestDraw();
  }

  get y(): number {
    return this._attrs.y || 0;
  }

  set y(val: number) {
    this._attrs.y = val;
    this._dirtyTransform = true;
    this._requestDraw();
  }

  get radiusX(): number {
    return this._attrs.radiusX || 0;
  }

  set radiusX(val: number) {
    this._attrs.radiusX = val;
    this._dirtyShape = true;
    this._requestDraw();
  }

  get width() {
    return this.radiusX * 2;
  }

  get height() {
    return this.radiusY * 2;
  }

  get radiusY(): number {
    return this._attrs.radiusY || 0;
  }

  set radiusY(val: number) {
    this._attrs.radiusY = val;
    this._dirtyShape = true;
    this._requestDraw();
  }

  get fill(): string {
    return this._attrs.fill || 'black';
  }

  set fill(val: string) {
    this._attrs.fill = val;
    this._rgba = colorToRGBA(this.fill);
    this._requestDraw();
  }

  set(attributes) {
    Object.assign(this, attributes);
  }

  _requestDraw() {
    if (this.parentElement) {
      this.parentElement.requestDraw();
    }
  }

  _calculateShape() {
    const dAngle = (Math.PI * 2) / EDGES;

    for (var i = 0; i < EDGES; i++) {
      const angle = i * dAngle;
      this._shape[i * 6 + 0] = 0;
      this._shape[i * 6 + 1] = 0;
      this._shape[i * 6 + 2] = Math.cos(angle + dAngle / 2) * this.radiusX;
      this._shape[i * 6 + 3] = Math.sin(angle + dAngle / 2) * this.radiusY;
      this._shape[i * 6 + 4] = Math.cos(angle - dAngle / 2) * this.radiusX;
      this._shape[i * 6 + 5] = Math.sin(angle - dAngle / 2) * this.radiusY;
    }
    this._dirtyShape = false;
  }

  _getTransform() {
    if (this._dirtyTransform) {
      this._transform[0] = this.x;
      this._transform[1] = this.y;
    }
    return this._transform;
  }

  draw(stage: Stage) {
    // Set the translation.
    stage.gl.uniform2fv(stage.translationLocation, this._getTransform());

    if (this._dirtyShape) {
      this._calculateShape();
    }
    stage.gl.bufferData(
      stage.gl.ARRAY_BUFFER,
      this._shape,
      stage.gl.DYNAMIC_DRAW
    );

    // Set a random color.
    stage.gl.uniform4f(
      stage.colorUniformLocation,
      this._rgba.r / 255,
      this._rgba.g / 255,
      this._rgba.b / 255,
      this._rgba.a
    );

    // Draw the rectangle.
    stage.gl.drawArrays(stage.gl.TRIANGLES, 0, this._shape.length / 2);
  }
}
