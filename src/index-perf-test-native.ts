import Konva from 'konva';

import runTest from './test-setup';

const canvas = document.createElement('canvas');
document.querySelector('#canvas').appendChild(canvas);

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';

const ctx = canvas.getContext('2d');
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
ctx.fillStyle = 'black';

runTest({
  createNode: shape => {
    shape.fill = Konva.Util.getRandomColor();
    return null;
  },
  updateNode: (node, shape) => {
    ctx.fillStyle = shape.fill;
    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
  },
  beforeUpdate: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  addNode: node => {}
});
