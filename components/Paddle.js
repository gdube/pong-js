class Paddle {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 100;
    this.score = 0;
    this.speed = 5;
    this.move = DIRECTION.IDLE;
  }

  addScore() {
    this.score += 1;
  }

  getScore() {
    return this.score;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  draw(context) {
    context.fillStyle = COLOURS.WHITE;

    context.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
