class PaddleBot extends Paddle {
  SPEED_INCREMENT = 0.2;

  constructor(parameters) {
    super(parameters);
  }

  levelUp() {
    this.score = 0;
    this.speed += this.SPEED_INCREMENT;
  }

  handleUpMovement(target) {
    if (this.y > target.y - (this.height / 2)) {
      if (target.moveX === DIRECTION.RIGHT) {
        this.y -= this.speed;
      } else {
        this.y -= this.speed / 4;
      }
    }
  }

  handleDownMovement(target) {
    if (this.y < target.y - (this.height / 2)) {
      if (target.moveX === DIRECTION.RIGHT) {
        this.y += this.speed;
      } else {
        this.y += this.speed / 4;
      }
    }
  }

  handleWallCollision(canvas) {
    if (this.y >= canvas.height - this.height) {
      this.y = canvas.height - this.height;
    } else if (this.y <= 0) {
      this.y = 0;
    }
  }

  update(canvas, target) {
    this.handleUpMovement(target);
    this.handleDownMovement(target);
    this.handleWallCollision(canvas);
  }
}
