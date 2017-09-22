function Ball(canvas) {
	this.position = {};
	this.radius;
	this.ctx = canvas.getContext('2d');
}

Ball.prototype.setPosition = function (x, y) {
	this.position = { x, y };
}

Ball.prototype.setRadius = function (radius) {
	this.radius = radius;
}

Ball.prototype.render = function () {
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

export default Ball;
