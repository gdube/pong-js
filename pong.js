// Global Settings
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6'];

// The ball object (The circle that bounces back and forth)
var Ball = {
	new: function () {
		var centerX = (this.canvas.width / 2) - 9;
		var centerY = (this.canvas.height / 2) - 9;

		return {
			width: 18,
			height: 18,
			x: centerX,
			y: centerY,
			centerX: centerX,
			centerY: centerY,
			moveX: DIRECTION.IDLE,
			moveY: DIRECTION.IDLE,
			speed: 9
		};
	}
};

// The paddle object (The two lines that move up and down)
var Paddle = {
	new: function (side) {
		return {
			width: 18,
			height: 70,
			x: side === 'left' ? 150 : this.canvas.width - 150,
			y: (this.canvas.height / 2) - 35,
			score: 0,
			move: DIRECTION.IDLE,
			speed: 10,
			wins: 0
		};
	}
};

// The Pong Object - This the primary object that contains the
// primary functions that allow the Pong to run.
var Game = {
	initialize: function () {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = 1400;
		this.canvas.height = 1000;

		this.canvas.style.border = '1px solid';
		this.canvas.style.width = '700px';
		this.canvas.style.height = '500px';

		this.player = Paddle.new.call(this, 'left');
		this.paddle = Paddle.new.call(this, 'right');

		this.paddle.speed = 8;

		this.ball = Ball.new.call(this);
		this.running = false;
		this.turn = this.player;
		this.timer = 0;
		this.round = 0;
		this.over = false;

		this.color = '#2c3e50';

		Pong.menu();
		Pong.listen();
	},

	generateRoundColor: function () {
		var newColor = colors[Math.floor(Math.random() * colors.length)];
		if (newColor === this.color) return Pong.generateRoundColor();
		else return newColor;
	},

	end: function (text) {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d');

		// Change the canvas font size and color
		this.context.font = '50px Courier New';
		this.context.fillStyle = this.color;

		// Draw the white rectangle behind the
		// 'Press any key to begin' text.
		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 50,
			700,
			100
		);

		// Change the canvas color;
		this.context.fillStyle = '#ffffff';

		// Draw the Pong over text
		this.context.fillText(text,
			this.canvas.width / 2,
			this.canvas.height / 2 + 15
		);

		setTimeout(function () {
			Pong = Object.assign({}, Game);
			Pong.initialize();
		}, 3000);
	},

	menu: function () {
		// Draw all the Pong objects in their current state
		Pong.draw();

		// Change the canvas font size and color
		this.context.font = '50px Courier New';
		this.context.fillStyle = this.color;

		// Draw the white rectangle behind the
		// 'Press any key to begin' text.
		this.context.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 50,
			700,
			100
		);

		// Change the canvas color;
		this.context.fillStyle = '#ffffff';

		// Draw the paddles score (right)
		this.context.fillText('Press any key to begin',
			this.canvas.width / 2,
			this.canvas.height / 2 + 15
		);
	},

	update: function () {
		if (!this.over) {
			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.ball.x <= 0) {
				this.oldSpeed = this.ball.speed;
				this.ball = Ball.new.call(this);
				this.ball.speed = this.oldSpeed;
				this.paddle.score++;
				this.turn = this.player;
				this.timer = (new Date()).getTime();
				beep2.play();
			}

			if (this.ball.x >= this.canvas.width - this.ball.width) {
				this.oldSpeed = this.ball.speed;
				this.ball = Ball.new.call(this);
				this.ball.speed = this.oldSpeed;
				this.player.score++;
				this.turn = this.paddle;
				this.timer = (new Date()).getTime();
				beep2.play();
			}

			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

			// Move player if they player.move value was updated by a keyboard event
			if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
			else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

			// On new throw (start of each turn) move the ball to the correct side
			// and randomize the landing direction to add some challenge.

			if ((new Date()).getTime() - this.timer >= 1000) {
				if (this.turn === this.player) {
					this.turn = null;
					this.ball.moveX = DIRECTION.LEFT;
					this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
					this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
				} else if (this.turn === this.paddle) {
					this.turn = null;
					this.ball.moveX = DIRECTION.RIGHT;
					this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
					this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
				}
			}

			// If the player collides with the bound limits - correct x and y coords.
			if (this.player.y <= 0) this.player.y = 0;
			else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

			// Move ball in intended direction based on moveY and moveX values
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

			// Handle paddle (AI) UP and DOWN movement
			if (this.paddle.y > this.ball.y - (this.paddle.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y -= this.paddle.speed / 1.5;
				else this.paddle.y -= this.paddle.speed / 4;
			}
			if (this.paddle.y < this.ball.y - (this.paddle.height / 2)) {
				if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y += this.paddle.speed / 1.5;
				else this.paddle.y += this.paddle.speed / 4;
			}

			// Handle paddle (AI) wall collision
			if (this.paddle.y >= this.canvas.height - this.paddle.height) this.paddle.y = this.canvas.height - this.paddle.height;
			else if (this.paddle.y <= 0) this.paddle.y = 0;

			// Handle Player-Ball collisions
			if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
				if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
					beep1.play();
					this.ball.x = (this.player.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;
				}
			}

			// Handle paddle-ball collision
			if (this.ball.x - this.ball.width <= this.paddle.x && this.ball.x >= this.paddle.x - this.paddle.width) {
				if (this.ball.y <= this.paddle.y + this.paddle.height && this.ball.y + this.ball.height >= this.paddle.y) {
					beep1.play();
					this.ball.x = (this.paddle.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;
				}
			}
		}

		// End of round
		// Check to see if the player one the round.
		if (this.player.score === rounds[this.round]) {
			// Check to see if there are any more rounds/levels left and display the victory screen if
			// there are not.
			if (!rounds[this.round + 1]) {
				this.over = true;
				setTimeout(function () {
					Pong.end('Winner!');
				}, 1000);
			} else {
				// If there is another round, reset all the values and increment the round number.
				this.color = this.generateRoundColor();
				this.round += 1;
				this.player.score = 0;
				this.paddle.score = 0;
				this.player.speed += 0.5;
				this.paddle.speed += 1;
				this.ball.speed += 1;

				beep3.play();
			}
		}
		// Check to see if the paddle/AI has one the round.
		else if (this.paddle.score === rounds[this.round]) {
			this.over = true;
			setTimeout(function () {
				Pong.end('Game Over!');
			}, 1000);
		}
	},

	draw: function () {
		// Clear the Canvas
		this.context.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to black
		this.context.fillStyle = this.color;

		// Draw the background
		this.context.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to white (For the paddles and the ball)
		this.context.fillStyle = '#ffffff';

		// Draw the Player
		this.context.fillRect(
			this.player.x,
			this.player.y,
			this.player.width,
			this.player.height
		);

		// Draw the Paddle
		this.context.fillRect(
			this.paddle.x,
			this.paddle.y,
			this.paddle.width,
			this.paddle.height
		);

		// Draw the Ball
		if (((new Date()).getTime() - this.timer >= 1000)) {
			this.context.fillRect(
				this.ball.x,
				this.ball.y,
				this.ball.width,
				this.ball.height
			);
		}

		// Draw the net (Line in the middle)
		this.context.beginPath();
		this.context.setLineDash([7, 15]);
		this.context.moveTo(
			(this.canvas.width / 2),
			this.canvas.height - 140
		);
		this.context.lineTo(
			(this.canvas.width / 2),
			140
		);
		this.context.lineWidth = 10;
		this.context.strokeStyle = '#ffffff';
		this.context.stroke();

		// Set the default canvas font and align it to the center
		this.context.font = '100px Courier New';
		this.context.textAlign = 'center';

		// Draw the players score (left)
		this.context.fillText(
			this.player.score.toString(),
			(this.canvas.width / 2) - 300,
			200
		);

		// Draw the paddles score (right)
		this.context.fillText(
			this.paddle.score.toString(),
			(this.canvas.width / 2) + 300,
			200
		);

		// Change the font size for the center score text
		this.context.font = '30px Courier New';

		// Draw the winning score (center)
		this.context.fillText(
			'Round ' + (Pong.round + 1),
			(this.canvas.width / 2),
			35
		);

		// Change the font size for the center score value
		this.context.font = '40px Courier';

		// Draw the current round number
		this.context.fillText(
			rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
			(this.canvas.width / 2),
			100
		);
	},

	loop: function () {
		// Update all objects (move the player, paddle, ball, increment the score, etc.)
		Pong.update();

		// Draw the objects to the canvas element
		Pong.draw();

		// If the game is not over, draw the next frame.
		if (!Pong.over) requestAnimationFrame(Pong.loop);
	},

	listen: function () {
		document.addEventListener('keydown', function (key) {
			// Handle the 'Press any key to begin' function and start the game.
			if (Pong.running === false) {
				Pong.running = true;
				window.requestAnimationFrame(Pong.loop);
			}

			// Handle up arrow and w key events
			if (key.keyCode === 38 || key.keyCode === 87) {
				Pong.player.move = DIRECTION.UP;
			}

			// Handle down arrow and s key events
			if (key.keyCode === 40 || key.keyCode === 83) {
				Pong.player.move = DIRECTION.DOWN;
			}
		});

		// Stop the player from moving when there are no keys being pressed.
		document.addEventListener('keyup', function (key) {
			Pong.player.move = DIRECTION.IDLE;
		});
	}
};

var Pong = Object.assign({}, Game);
Pong.initialize();