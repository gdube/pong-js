class PaddleBot extends Paddle {
  SPEED_INCREMENT = 20;

  constructor(parameters) {
    super(parameters);
  }

  levelUp() {
    this.score = 0;
    this.speed += this.SPEED_INCREMENT;
  }

  handleUpMovement(delta, target) {
    if (this.y > target.y - (this.height / 2)) {
      if (target.moveX === DIRECTION.RIGHT) {
        this.y -= this.speed * delta;
      } else {
        this.y -= (this.speed / 4) * delta;
      }
    }
  }

  handleDownMovement(delta, target) {
    if (this.y < target.y - (this.height / 2)) {
      if (target.moveX === DIRECTION.RIGHT) {
        this.y += this.speed * delta;
      } else {
        this.y += (this.speed / 4) * delta;
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

  update(canvas, target, delta) {
    this.handleUpMovement(delta, target);
    this.handleDownMovement(delta, target);
    this.handleWallCollision(canvas);
  }
}
