class Player extends Paddle {
  SPEED_INCREMENT = 0.3;

  constructor(parameters) {
    super(parameters);
    this.speed = 7;
  }

  levelUp() {
    this.score = 0;
    this.speed += this.SPEED_INCREMENT;
  }

  handleMovement() {
    if (this.move === DIRECTION.UP) {
      this.y -= this.speed;
    } else if (this.move === DIRECTION.DOWN) {
      this.y += this.speed;
    }
  }

  handleWallCollision(canvas) {
    if (this.y <= 0) {
      this.y = 0;
    } else if (this.y >= (canvas.height - this.height)) {
      this.y = (canvas.height - this.height);
    }
  }

  update(canvas) {
    this.handleMovement();
    this.handleWallCollision(canvas);
  }
}
