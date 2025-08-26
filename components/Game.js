class Game {
	SCREEN_WIDTH = 1800;
	SCREEN_HEIGHT = 1100;
	TURN_DELAY_MS = 1000;
	MENU_DELAY_MS = 1000;
	WALL_OFFSET = 150;

	constructor() {
		this.canvas = document.querySelector('canvas');
		this.context = this.canvas.getContext('2d', {
			alpha: false,
		});

		this.canvas.width = this.SCREEN_WIDTH;
		this.canvas.height = this.SCREEN_HEIGHT;

		this.canvas.style.width = `${this.canvas.width / 2}px`;
		this.canvas.style.height = `${this.canvas.height / 2}px`;

		this.initialize();
		this.listen();
	};

	initialize() {
		this.availableColours = ROUND_COLOURS;

		this.playerA = new Player({
			x: this.WALL_OFFSET,
			y: this.canvas.height / 2
		});

		this.playerB = new PaddleBot({
			x: this.canvas.width - this.WALL_OFFSET,
			y: this.canvas.height / 2,
		});

		this.ball = new Ball({
			x: this.canvas.width / 2,
			y: this.canvas.height / 2
		});

		this.round = 0;
		this.running = false;
		this.gameOver = false;
		this.paused = false;
		this.playerTurn = this.playerB;
		this.timer = performance.now();
		this.colour = COLOURS.DEFAULT;

		this.showMenuScreen('Press a key to begin');
	}

	showMenuScreen(text, callback) {
		const RECTANGLE_WIDTH = 700;
		const RECTANGLE_HEIGHT = 100;
		const MENU_TIMEOUT_MS = 3000;

		this.draw();

		this.context.font = '50px Courier New';
		this.context.fillStyle = this.colour;

		this.context.fillRect(
			this.canvas.width / 2 - (RECTANGLE_WIDTH / 2),
			this.canvas.height / 2 - (RECTANGLE_HEIGHT / 2),
			RECTANGLE_WIDTH,
			RECTANGLE_HEIGHT
		);

		this.context.fillStyle = COLOURS.WHITE;
		this.context.textAlign = 'center';

		this.context.fillText(text,
			this.canvas.width / 2,
			this.canvas.height / 2
		);

		if (callback) {
			setTimeout(callback.bind(this), MENU_TIMEOUT_MS);
		}
	};

	hasCollision(ball, player) {
		return (
			ball.x < player.x + player.width &&
			ball.x + ball.width > player.x &&
			ball.y < player.y + player.height &&
			ball.y + ball.height > player.y
		);
	};

	levelUp() {
		this.round += 1;
		this.playerA.levelUp();
		this.playerB.levelUp();
		this.ball.levelUp();
		this.colour = this.getRandomColour();

		beep3.play();
	}

	hasWonRound(object) {
		return object.getScore() >= ROUNDS[this.round];
	}

	hasNextRound() {
		return ROUNDS[this.round + 1];
	}

	getServeDirection() {
		return this.playerTurn === this.playerA ? DIRECTION.RIGHT : DIRECTION.LEFT;
	}

	update() {
		this.ball.update(this.canvas);
		this.playerB.update(this.canvas, this.ball);
		this.playerA.update(this.canvas);

		if (this.ball.isOutOfLeftBounds()) {
			this.resetTurn(this.playerB, this.playerA);
		} else if (this.ball.isOutOfRightBounds(this.canvas)) {
			this.resetTurn(this.playerA, this.playerB);
		}

		if (this.isTurnDelayOver() && this.playerTurn) {
			const direction = this.getServeDirection();
			this.ball.handleServe(this.playerTurn, direction);
			this.playerTurn = null;
		}

		if (this.hasCollision(this.ball, this.playerA)) {
			this.ball.handlePaddleCollision(this.playerA);
		}

		if (this.hasCollision(this.ball, this.playerB)) {
			this.ball.handlePaddleCollision(this.playerB);
		}

		if (this.hasWonRound(this.playerA)) {
			if (!this.hasNextRound()) {
				this.gameOver = true;
				const showMenuScreen = this.showMenuScreen.bind(this, 'Winner!', this.initialize);
				setTimeout(showMenuScreen, this.MENU_DELAY_MS);
			} else {
				this.levelUp();
			}
		} else if (this.hasWonRound(this.playerB)) {
			this.gameOver = true;
			const showMenuScreen = this.showMenuScreen.bind(this, 'Game Over!', this.initialize);
			setTimeout(showMenuScreen, this.MENU_DELAY_MS);
		}
	};

	drawCourtNet() {
		this.context.beginPath();
		this.context.setLineDash([2, 15]);
		this.context.moveTo((this.canvas.width / 2), this.canvas.height - this.WALL_OFFSET);
		this.context.lineTo((this.canvas.width / 2), this.WALL_OFFSET);
		this.context.lineWidth = 10;
		this.context.strokeStyle = COLOURS.WHITE;
		this.context.stroke();
	}

	drawPlayerScores() {
		const SCORE_X_PADDING = 300;
		const SCORE_Y_PADDING = 200;

		this.context.font = '100px Courier New';
		this.context.textAlign = 'center';

		this.context.fillText(
			this.playerA.getScore().toString(),
			(this.canvas.width / 2) - SCORE_X_PADDING,
			SCORE_Y_PADDING
		);

		this.context.fillText(
			this.playerB.getScore().toString(),
			(this.canvas.width / 2) + SCORE_X_PADDING,
			SCORE_Y_PADDING
		);
	}

	drawRoundCount() {
		const ROUND_Y_PADDING = 45;

		this.context.font = '25px Courier New';

		this.context.fillText(
			`ROUND ${this.round + 1} OF ${ROUNDS.length}`,
			(this.canvas.width / 2),
			ROUND_Y_PADDING
		);
	}

	drawRoundScore() {
		const GOAL_Y_PADDING = 100;

		this.context.font = '30px Courier New';

		this.context.fillText(
			`${ROUNDS[this.round]} TO WIN`,
			(this.canvas.width / 2),
			GOAL_Y_PADDING
		);
	}

	draw() {
		this.context.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		this.context.fillStyle = this.colour;

		this.context.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		this.playerA.draw(this.context);
		this.playerB.draw(this.context);

		if (this.isTurnDelayOver()) {
			this.ball.draw(this.context);
		}

		this.drawCourtNet();
		this.drawPlayerScores();
		this.drawRoundCount();
		this.drawRoundScore();
	};

	loop() {
		if (this.paused) {
			return;
		}

		this.update();
		this.draw();

		if (!this.gameOver) {
			requestAnimationFrame(this.loop.bind(this));
		}
	};

	togglePause() {
		if (this.paused) {
			window.requestAnimationFrame(this.loop.bind(this));
			this.paused = false;
		} else {
			this.showMenuScreen('Paused');
			this.paused = true;
		}
	}

	listen() {
		document.addEventListener('keydown', ({ key }) => {
			if (this.running === false) {
				this.running = true;
				window.requestAnimationFrame(this.loop.bind(this));
			}

			if (key === 'w' || key === 'ArrowUp') {
				this.playerA.move = DIRECTION.UP;
			}

			if (key === 's' || key === 'ArrowDown') {
				this.playerA.move = DIRECTION.DOWN;
			}

			if (key === 'Escape') {
				this.togglePause();
			}
		});

		document.addEventListener('keyup', () => {
			this.playerA.move = DIRECTION.IDLE;
		});
	};

	resetTurn(winner, loser) {
		this.ball.reset();
		this.playerTurn = loser;
		this.timer = performance.now();

		winner.addScore();
		beep2.play();
	};

	isTurnDelayOver() {
		return performance.now() - this.timer >= this.TURN_DELAY_MS;
	};

	getRandomColour() {
		const index = Math.floor(Math.random() * this.availableColours.length);
		const colour = this.availableColours[index];

		this.availableColours.splice(index, 1);

		return colour;
	};
};
