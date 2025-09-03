class Ball {
  BALL_SIZE = 20;
  BALL_SPEED = 900;
  BALL_SPEED_LEVEL_INCREMENT = 20;

  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.width = this.BALL_SIZE;
    this.height = this.BALL_SIZE;
    this.speedX = this.BALL_SPEED;
    this.speedY = this.BALL_SPEED * (2 / 3);
    this.moveX = DIRECTION.IDLE;
    this.moveY = DIRECTION.IDLE;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.moveX = DIRECTION.IDLE;
    this.moveY = DIRECTION.IDLE;
  }

  levelUp() {
    this.speedX += this.BALL_SPEED_LEVEL_INCREMENT;
    this.speedY += this.BALL_SPEED_LEVEL_INCREMENT;
  }

  isOutOfLeftBounds() {
    return this.x < 0;
  }

  isOutOfRightBounds(canvas) {
    return this.x >= canvas.width - this.width;
  }

  handlePaddleCollision(paddle) {
    if (this.moveX === DIRECTION.LEFT) {
      this.x = paddle.getX() + this.width;
      this.moveX = DIRECTION.RIGHT;
    } else {
      this.x = paddle.getX() - this.width;
      this.moveX = DIRECTION.LEFT;
    }

    beep1.play();
  }

  handleWallCollision(canvas) {
    if (this.y <= 0) {
      this.moveY = DIRECTION.DOWN;
    } else if (this.y >= canvas.height - this.height) {
      this.moveY = DIRECTION.UP;
    }
  }

  handleVerticalMovement(delta) {
    if (this.moveY === DIRECTION.UP) {
      this.y -= this.speedY * delta;
    } else if (this.moveY === DIRECTION.DOWN) {
      this.y += this.speedY * delta;
    }
  }

  handleHorizontalMovement(delta) {
    if (this.moveX === DIRECTION.LEFT) {
      this.x -= this.speedX * delta;
    } else if (this.moveX === DIRECTION.RIGHT) {
      this.x += this.speedX * delta;
    }
  }

  getRandomDirection() {
    const directions = [DIRECTION.UP, DIRECTION.DOWN];
    const index = Math.round(Math.random());

    return directions[index];
  }

  handleServe(server, direction) {
    this.moveX = direction;
    this.moveY = this.getRandomDirection();
    this.y = server.y + (server.height / 2);
    this.x = server.x + (direction === DIRECTION.LEFT ? - server.width : server.width);
  }

  update(canvas, delta) {
    this.handleVerticalMovement(delta);
    this.handleHorizontalMovement(delta);
    this.handleWallCollision(canvas);
  }

  draw(context) {
    context.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}
