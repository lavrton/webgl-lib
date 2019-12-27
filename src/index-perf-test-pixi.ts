import * as PIXI from 'pixi.js';
import runTest from './test-setup';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 16777215,
  resolution: window.devicePixelRatio || 1
});
document.querySelector('#canvas').appendChild(app.view);

runTest({
  createNode: shape => {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(Math.floor(Math.random() * 16777215));
    graphics.drawRect(0, 0, shape.width, shape.height);
    graphics.endFill();
    return graphics;
  },
  updateNode: (node, shape) => {
    node.x = shape.x;
    node.y = shape.y;
  },
  beforeUpdate: null,
  addNode: node => {
    app.stage.addChild(node);
  }
});
