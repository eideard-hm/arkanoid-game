const canvas = document.querySelector('canvas');
const $sprite = document.querySelector('#sprite');

const ctx = canvas.getContext('2d');

canvas.width = 448;
canvas.height = 512;

// ball variables
const BALL_RADIUS = 3;
let ballX = canvas.width / 2;
let ballY = canvas.height - 25;
// valocidad de la pelota
let dx = 3;
let dy = -2;

// variables de la pala
const PADDLE_HEIGHT = 10;
const PADDLE_WIDTH = 50;
// Posiciones de la pala
let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
let paddleY = canvas.height - PADDLE_HEIGHT - 10;
let rightPressed = false;
let leftPressed = false;

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
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

  if (
    ballX + dx > paddleX &&
    ballX + dx < paddleX + PADDLE_WIDTH &&
    ballY + dy > paddleY
  ) {
    dy = -dy;
  }

  if (ballY - dy > canvas.height - BALL_RADIUS) {
    console.log('Game over');
    document.location.reload();
  }

  ballX += dx;
  ballY += dy;
}

function drawPaddle() {
  ctx.drawImage(
    $sprite,
    29,
    174,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    paddleX,
    paddleY,
    PADDLE_WIDTH,
    PADDLE_HEIGHT
  );
}

function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  document.addEventListener('touchstart', touchStartHandler, { passive: true });
  document.addEventListener(
    'touchend',
    () => {
      rightPressed = false;
      leftPressed = false;
    },
    { passive: true }
  );
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function touchStartHandler(e) {
  const touchX = e.touches[0].clientX;

  if (touchX > canvas.width / 2) {
    rightPressed = true;
  } else {
    leftPressed = true;
  }
}

function draw() {
  cleanCanvas();

  drawBall();

  ballMovement();

  drawPaddle();

  paddleMovement();

  window.requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', () => {
  initEvents();

  draw();
});
