class Ball {
	constructor(canvas) {
		this.position = {};
		this.radius;
		this.ctx = canvas.getContext('2d');
	}

	setPosition(x, y) {
		this.position = { x, y };
	}

	setRadius(radius) {
		this.radius = radius;
	}

	render() {
		const { position } = this;

		if (position.x && position.y) {
			this.ctx.beginPath();
			this.ctx.fillStyle = "white";
			this.ctx.arc(
				this.position.x,
				this.position.y,
				this.radius,
				0,
				2 * Math.PI,
				false
			);

			this.ctx.fill();
		}
	}
}

export default Ball;
