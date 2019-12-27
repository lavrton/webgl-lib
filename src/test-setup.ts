export default function runTest({
  createNode,
  updateNode,
  addNode,
  beforeUpdate
}) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var shapes = [];
  var gravity = 0.75;

  var maxX = width - 10;
  var minX = 0;
  var maxY = height - 10;
  var minY = 0;

  var startshapeCount = 20;
  var isAdding = false;
  var count = 0;
  var stats;
  var amount = 10;
  var counter;

  // var Stats : any;
  stats = new Stats();
  document.body.appendChild(stats.domElement);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';

  window.requestAnimationFrame(update);

  counter = document.createElement('div');
  counter.className = 'counter';
  counter.style.position = 'absolute';
  counter.style.top = '50px';

  document.body.appendChild(counter);

  count = startshapeCount;
  counter.innerHTML = startshapeCount + ' BUNNIES';

  window.addEventListener('mousedown', function() {
    isAdding = true;
  });

  window.addEventListener('mouseup', function() {
    isAdding = false;
  });

  document.addEventListener('touchstart', onTouchStart, true);
  document.addEventListener('touchend', onTouchEnd, true);

  function onTouchStart() {
    isAdding = true;
  }

  function onTouchEnd() {
    isAdding = false;
  }

  function createShape() {
    const shape = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      speedX: Math.random() * 10,
      speedY: Math.random() * 10 - 5,
      node: null
    };
    shape.node = createNode(shape);
    addNode(shape.node);
    shapes.push(shape);
    return shape;
  }

  for (var i = 0; i < startshapeCount; i++) {
    const shape = createShape();
    shapes.push(shape);
    count++;
  }

  function update() {
    stats.begin();
    beforeUpdate && beforeUpdate();
    if (isAdding) {
      // add 10 at a time :)

      for (var i = 0; i < amount; i++) {
        const shape = createShape();
        shapes.push(shape);
        count++;
      }
      counter.innerHTML = count + ' BUNNIES';
    }

    for (var i = 0; i < shapes.length; i++) {
      const shape = shapes[i];

      shape.x += shape.speedX;
      shape.y += shape.speedY;
      shape.speedY += gravity;
      if (shape.x > maxX - shape.width) {
        shape.speedX *= -1;
        shape.x = maxX - shape.width;
      } else if (shape.x < minX) {
        shape.speedX *= -1;
        shape.x = minX;
      }

      if (shape.y > maxY - shape.height) {
        shape.speedY *= -0.85;
        shape.y = maxY - shape.height;
        if (Math.random() > 0.5) {
          shape.speedY -= Math.random() * 6;
        }
      } else if (shape.y < minY) {
        shape.speedY = 0;
        shape.y = minY;
      }
      updateNode(shape.node, shape);
    }
    requestAnimationFrame(update);
    stats.end();
  }
}
