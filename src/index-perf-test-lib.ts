import Stage from './lib/stage';
import Rect from './lib/rectangle';
import { getRandomColor } from './lib/colors';

import runTest from './test-setup';

const canvas = document.createElement('canvas');
document.querySelector('#canvas').appendChild(canvas);
const stage = new Stage({
  canvas
});

runTest({
  createNode: shape => {
    return new Rect({
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      fill: getRandomColor()
    });
  },
  beforeUpdate: null,
  updateNode: (node, shape) => {
    node.x = shape.x;
    node.y = shape.y;
  },
  addNode: node => {
    stage.add(node);
  }
});
