import Konva from 'konva';

import runTest from './test-setup';

const stage = new Konva.Stage({
  container: 'canvas',
  width: window.innerWidth,
  height: window.innerHeight
});

const layer = new Konva.Layer({
  hitGraphEnabled: false
});
stage.add(layer);

runTest({
  createNode: shape => {
    return new Konva.Rect({
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      fill: Konva.Util.getRandomColor()
    });
  },
  updateNode: (node, shape) => {
    node.x(shape.x);
    node.y(shape.y);

    layer.batchDraw();
  },
  addNode: node => {
    layer.add(node);
  }
});
