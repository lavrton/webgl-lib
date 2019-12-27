import Stage from './stage';
import { colorToRGBA } from './colors';
import poly from 'extrude-polyline';

export default class Line {
  parentElement: any;
  _attrs: any = {};

  _rgba = {
    r: 0,
    g: 0,
    b: 0,
    a: 1
  };
  _shape = new Float32Array(20 * 3 * 2);
  _dirtyShape = true;
  _transform = new Float32Array(2);
  _dirtyTransform = true;
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

  get points(): Array<{ x: number; y: number }> {
    return this._attrs.points || [];
  }

  set points(val: Array<{ x: number; y: number }>) {
    this._attrs.points = val;
    this._dirtyShape = true;
    this._requestDraw();
  }

  get strokeWidth(): number {
    return this._attrs.strokeWidth || 1;
  }

  set strokeWidth(val: number) {
    this._attrs.strokeWidth = val;
    this._dirtyShape = true;
    this._requestDraw();
  }

  // get width() {
  //   return this.radiusX * 2;
  // }

  // get height() {
  //   return this.radiusY * 2;
  // }

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
    const stroke = poly({
      thickness: this.strokeWidth,
      // cap: 'square',
      join: 'bevel'
    });

    //builds a triangulated mesh from a polyline
    const polyline = this.points.map(p => {
      return [p.x, p.y];
    });
    const mesh = stroke.build(polyline);
    this._shape = new Float32Array(mesh.cells.length * 3 * 2);
    mesh.cells.forEach((cell, i) => {
      const pos1 = mesh.positions[cell[0]];
      const pos2 = mesh.positions[cell[1]];
      const pos3 = mesh.positions[cell[2]];
      this._shape[i * 6] = pos1[0];
      this._shape[i * 6 + 1] = pos1[1];
      this._shape[i * 6 + 2] = pos2[0];
      this._shape[i * 6 + 3] = pos2[1];
      this._shape[i * 6 + 4] = pos3[0];
      this._shape[i * 6 + 5] = pos3[1];
    });
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
