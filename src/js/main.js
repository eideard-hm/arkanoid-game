const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 448;
canvas.height = 512;

// ball variables
const BALL_RADIUS = 3;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 2;
let dy = -2;

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
}

function ballMovement() {
  if (ballX + dx > canvas.width - BALL_RADIUS || ballX + dx < BALL_RADIUS) {
    dx = -dx;
  }
  if (ballY + dy > canvas.height - BALL_RADIUS || ballY + dy < BALL_RADIUS) {
    dy = -dy;
  }

  ballX += dx;
  ballY += dy;
}

function draw() {
  drawBall();

  ballMovement();

  window.requestAnimationFrame(draw);
}

draw();
