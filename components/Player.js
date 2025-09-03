class Player extends Paddle {
  SPEED_INCREMENT = 20;

  constructor(parameters) {
    super(parameters);
    this.speed = 700;
  }

  move(direction) {
    this.movement = direction;
  }

  levelUp() {
    this.score = 0;
    this.speed += this.SPEED_INCREMENT;
  }

  handleMovement(delta) {
    if (this.movement === DIRECTION.UP) {
      this.y -= this.speed * delta;
    } else if (this.movement === DIRECTION.DOWN) {
      this.y += this.speed * delta;
    }
  }

  handleWallCollision(canvas) {
    if (this.y <= 0) {
      this.y = 0;
    } else if (this.y >= (canvas.height - this.height)) {
      this.y = (canvas.height - this.height);
    }
  }

  update(canvas, delta) {
    this.handleMovement(delta);
    this.handleWallCollision(canvas);
  }
}
