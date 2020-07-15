let yoff = 0.0
var canvas;
var h;
var hmin;
var interval = 3;
var delta = 10;
var fishOnScreen = false;
var dir;

var fishes = [];

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.position(0,0);
  canvas.style('z-index', '-1');
  canvas.style('position', 'fixed')
  h = height;
  hmin = h/6;
}

function draw() {
  background(255);

  renderWave();

  // bring wave up if the height is greater than the minimum
  if (h >= hmin) {
    delta = h/50;
    console.log(delta);
    h -= delta;
    if (h < 500 && delta >= 5) {
      delta -= 0.1;
    }
  }

  // draw fishes
  fishes.forEach(function(fish, index) {
    if (isInRange(fish.x)) {
      fish.x += fish.step;
      drawFish(fish.color, fish.size, fish.x, fish.y, fish.dir);
    } else {
      fish = null;
    }
  });

  // if interval has been hit, create a new fish
  if(frameCount % (interval * 30) == 0) {
    // randomly choose direction
    dir = Math.random() < 0.5 ? 'r' : 'l';
    let fish;
    if (dir == 'l') {
      fish = {
        color: 'FB6376',
        x: displayWidth + 20,
        y: getRand(hmin*1.2, displayHeight*0.75),
        size: getRand(20,30),
        dir: dir,
        step: -1*getRand(2,5)
      }
    }
    else if (dir == 'r') {
      fish = {
        color: 'FB6376',
        x: -20,
        y: getRand(hmin*1.2, displayHeight*0.75),
        size: 25,
        dir: dir,
        step: getRand(2,5)
      }
    }
    fishes.push(fish);
    interval = Math.ceil(getRand(4,7));
  }
}

// stole this code from p5.js docs
// https://p5js.org/examples/math-noise-wave.html
function renderWave() {
  fill('#204051');
  beginShape();
  let xoff = yoff
  for (let x = 0; x <= width; x += 9) {
    let y = map(noise(xoff, yoff), 0, 1, 0, 100);
    vertex(x, (h)-y);
    xoff += 0.05;
  }
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function drawFish(color, size, fx, fy, dir) {
  fishW = size/2;
  fishH = size/4;
  offset = size/5;
  fy = h+fy;

  ellipseMode(CENTER);
  fill('#FB6376');

  noStroke();
  ellipse(fx, fy, fishW*2, fishH*2);

  // tailfin points
  var x1, x2, x3, y1, y2, y3;
  if (dir == 'r') {
    x1 = fx-fishW + offset;
    y1 = fy;

    x2 = fx-2*fishW + offset;
    y2 = fy-fishH;
    
    x3 = fx-2*fishW + offset;
    y3 = fy+fishH
  }
  else if (dir == 'l') {
    x1 = fx + fishW - offset;
    y1 = fy;

    x2 = fx + 2*fishW - offset;
    y2 = fy + fishH;
    
    x3 = fx + 2*fishW - offset;
    y3 = fy - fishH   
  }

  triangle(x1, y1, x2, y2, x3, y3);
}

// [min, max)
function getRand(min, max) {
  return Math.random() * (max - min) + min;
}

function isInRange(x) {
  return x > -50 && x < displayWidth + 50;
}

function mouseWheel(event) {
  h -= event.deltaY;
}

function windowResized() {
  resizeCanvas(displayWidth, displayHeight);
}