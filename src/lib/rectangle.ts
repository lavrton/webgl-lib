import Stage from './stage';
import { colorToRGBA } from './colors';

interface IRect {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

interface RGBA {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
}

export default class Rect implements IRect {
  parentElement: any;
  _attrs: any = {};

  _rgba = {
    r: 0,
    g: 0,
    b: 0,
    a: 0
  };
  _shape = new Float32Array(12);
  _dirtyShape = true;
  _transform = new Float32Array(2);
  _dirtyTransform = true;
  [index: string]: any;
  constructor(attributes: IRect) {
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

  get width(): number {
    return this._attrs.width || 0;
  }

  set width(val: number) {
    this._attrs.width = val;
    this._dirtyShape = true;
    this._requestDraw();
  }

  get height(): number {
    return this._attrs.height || 0;
  }

  set height(val: number) {
    this._attrs.height = val;
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
    this._shape[0] = 0;
    this._shape[1] = 0;
    this._shape[2] = this.width;
    this._shape[3] = 0;
    this._shape[4] = 0;
    this._shape[5] = this.height;
    this._shape[6] = 0;
    this._shape[7] = this.height;
    this._shape[8] = this.width;
    this._shape[9] = 0;
    this._shape[10] = this.width;
    this._shape[11] = this.height;
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
    var primitiveType = stage.gl.TRIANGLES;
    var count = 6;
    stage.gl.drawArrays(primitiveType, 0, count);
  }
}
