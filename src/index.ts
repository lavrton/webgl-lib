import Stage from './lib/stage';
import Rect from './lib/rectangle';
import Ellipse from './lib/ellipse';
import Line from './lib/line';
import { getRandomColor } from './lib/colors';

const stage = new Stage({
  canvas: document.getElementById('c')
});

window.stage = stage;

const ellipse = new Ellipse({
  x: 200,
  y: 200,
  radiusX: 100,
  radiusY: 100,
  fill: 'black'
});

stage.add(ellipse);

let isDrawing = false;
window.addEventListener('mousedown', e => {
  isDrawing = true;
  const line = new Line({
    points: [{ x: e.clientX, y: e.clientY }, { x: e.clientX, y: e.clientY }],
    strokeWidth: 4,
    fill: 'red'
  });
  stage.add(line);
});

const dist = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

window.addEventListener('mousemove', e => {
  if (!isDrawing) {
    return;
  }
  const line = stage.children[stage.children.length - 1];
  const lastPoint = line.points[line.points.length - 1];
  const newPoint = { x: e.clientX, y: e.clientY };
  if (dist(lastPoint, newPoint) < 10) {
    return;
  } else {
    line.points = line.points.concat([{ x: e.clientX, y: e.clientY }]);
  }
});

window.addEventListener('mouseup', e => {
  isDrawing = false;
});
