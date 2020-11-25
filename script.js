const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let isStart = true;

let upPressed = false;
let downPressed = false;

const score = {
  player: 0,
  ai: 0
}

class Paddle {
  constructor(width, height, x, y, speed) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
}

const paddle = new Paddle(10, 75, 7, 112.5, 5);
const aiPaddle = new Paddle(10, 75, 503, 112.5, 1);

const ball = {
  x: 260,
  y: 150,
  dx: -3,
  dy: Math.random() + 0.5,
  radius: 5,
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFF";
  ctx.fill();
  ctx.closePath();
}

function drawPaddles() {
  //Draws Paddle
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#FFF";
  ctx.fill();
  ctx.closePath();

  //Draws aiPaddle
  ctx.beginPath();
  ctx.rect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
  ctx.fillStyle = "#FFF";
  ctx.fill();
  ctx.closePath();
}

function drawLine() {
  ctx.setLineDash([12, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#FFF";
  ctx.stroke();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "48px Arial";
  ctx.fillStyle = "FFF";
  ctx.textAlign = "center";
  ctx.fillText(score.player, canvas.width / 4, canvas.width / 8);

  ctx.font = "48px Arial";
  ctx.fillStyle = "FFF";
  ctx.textAlign = "center";
  ctx.fillText(score.ai, canvas.width / 4 * 3, canvas.width / 8);

  if (ball.x + ball.dx + ball.radius > canvas.width) {
    score.player++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = Math.abs(ball.dx);
    ball.dx += 1;
    ball.dy = Math.random() + 0.5
    paddle.y = 112.5;
    aiPaddle.y = 112.5;
    aiPaddle.speed += 0.7;
  } else if (ball.x + ball.dx - ball.radius < 0) {
    score.ai++;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -Math.abs(ball.dx);
    ball.dy = Math.random() + 0.5
    paddle.y = 112.5;
    aiPaddle.y = 112.5;
  }
}

function controls() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
      upPressed = true;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
      downPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
      upPressed = false;
    } else if (e.key == "Down" || e.key == "ArrowDown") {
      downPressed = false;
    }
  }
}

function aiMovement() {
  if (Math.sign(ball.dx) === 1 && ball.x > canvas.width / 2) {
    if (ball.y > aiPaddle.y + aiPaddle.height - 20 && aiPaddle.y + aiPaddle.height + aiPaddle.speed < canvas.height) {
      aiPaddle.y += aiPaddle.speed;
    } else if (ball.y < aiPaddle.y + 20 && aiPaddle.y - aiPaddle.speed > 0) {
      aiPaddle.y -= aiPaddle.speed;
    }
  }
}

function paddleCollision() {
  if (ball.x - ball.radius < paddle.x + paddle.width && ball.y > paddle.y && ball.y < paddle.y + paddle.height) {
    ball.dx = Math.abs(ball.dx) + 0.1;
    ball.dy += 0.05;
  }
  if (ball.x + ball.radius > aiPaddle.x && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
    ball.dx = -Math.abs(ball.dx) - 0.1;
    ball.dy -= 0.05;
  }
}

function isGameOver() {
  const winner = document.getElementById('end');
  if (score.player === 5) {
    end.innerHTML = "You Win!";
    ball.dx = 0;
    ball.dy = 0;
    paddle.speed = 0;
    aiPaddle.speed = 0;
    document.addEventListener("keydown", reset, false);
  } else if (score.ai === 5) {
    end.innerHTML = "You Lose!";
    ball.dx = 0;
    ball.dy = 0;
    paddle.speed = 0;
    aiPaddle.speed = 0;
    document.addEventListener("keydown", reset, false);
  }

  function reset() {
    document.location.reload();
  }
}

//function drawPaddleY() {
//  ctx.beginPath();
//  ctx.arc(paddle.x, paddle.y, 2, 0, Math.PI *2);
//  ctx.fillStyle = "#F00";
//  ctx.fill();
//  ctx.closePath();
//}
drawBall();
drawPaddles();
drawLine();
drawScore();
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddles();
  drawLine();
  drawScore();
  paddleCollision();
  controls();
  aiMovement();
  isGameOver();
  //drawPaddleY();

  if (upPressed && paddle.y - paddle.speed >= 0) {
    paddle.y -= paddle.speed;
  } else if (downPressed && paddle.y + paddle.height + paddle.speed < canvas.height) {
    paddle.y += paddle.speed;
  }

  if (ball.y > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
    ball.dy *= -1;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", start, false);

function start() {
  if (isStart == true) {
    draw();
    isStart = false;
  }
}
