define(function(){
	// If side is 1, player will be on the left side.
	// Otherwise if 2, player will be on the right side
	function Paddle(side, canvas) {
		this.side = side;
		this.width = 30;
		this.height = 100;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.x = (side === 1) ? 20 : this.canvas.width - 20 - this.width;
		this.y = 20;
	}

	Paddle.prototype.moveUp = function (){
		this.y -= 10;
	}

	Paddle.prototype.moveDown = function (){
		this.y += 10;
	}

	Paddle.prototype.render = function (){
		this.ctx.beginPath();
		this.ctx.fillStyle = "yellow";
		this.ctx.rect(this.x, this.y, this.width, this. height);
		this.ctx.fill();
		// console.log('side: ' + this.side);
		// console.log('x: ' + this.x);
		// console.log('y: ' + this.y);
	}

	return Paddle
})
