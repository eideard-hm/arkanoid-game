const canvas = document.querySelector('canvas');
const $sprite = document.querySelector('#sprite');
const $bricks = document.querySelector('#bricks');

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

/* VARIABLES DE LOS LADRILLOS */
const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = []; // inicializamos con un array vacio
  for (let r = 0; r < brickRowCount; r++) {
    // calculamos la posicion del ladrillo en la pantalla
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
    // Asignar un color aleatorio a cada ladrillo
    const random = Math.floor(Math.random() * 8);
    // Guardamos la información de cada ladrillo
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random,
    };
  }
}

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

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32;

      ctx.drawImage(
        $bricks,
        clipX,
        0,
        brickWidth, // 31
        brickHeight, // 14
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      );
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick =
        ballX > currentBrick.x && ballX < currentBrick.x + brickWidth;

      const isBallSameYAsBrick =
        ballY > currentBrick.y && ballY < currentBrick.y + brickHeight;

      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy = -dy;
        currentBrick.status = BRICK_STATUS.DESTROYED;
      }
    }
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
  drawPaddle();
  drawBricks();
  collisionDetection();

  ballMovement();
  paddleMovement();

  window.requestAnimationFrame(draw);
}

document.addEventListener('DOMContentLoaded', () => {
  initEvents();

  draw();
});
