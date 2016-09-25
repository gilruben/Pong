define(function(){
	function Ball(radius, centerX, centerY, speed, canvas, paddleDim) {
		this.radius = radius;
		this.centerX = centerX;
		this.centerY = centerY;
		this.startPoint = {x: centerX, y: centerY};
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.speed = speed;
		this.paddleDim = paddleDim;
		this.direction = {x: -1, y: 1};
		this.timePassed = 0;
		this.ballOutOfBounds = false;
	}

	//moves the ball
	//startPoint is is an object with keys x and y, of where the ball will start
	//side will determine the direction, 1 is left, 2 is right;
	//paddle is an object that stores where the paddles are in the y-axis
	Ball.prototype.move = function (side, paddlePos, timePassed){
		this.timePassed += timePassed;

		if(this.timePassed >= 1000/this.speed){

			if(!this.ballOutOfBounds){
				//how much to move centerX and centerY
				var moveX = this.direction.x * Math.round(this.timePassed / (1000/this.speed));
				var moveY = this.direction.y * Math.round(this.timePassed / (1000/this.speed));

				//new x and y's for the center if the previous center were to move moveX or moveY respectively
				var newCenterX = moveX + this.centerX;
				var newCenterY = moveY + this.centerY;
			}


			// //redirects ball when it hits the edges of the x-axis by setting a new x coordinate
			// if(newCenterX < this.radius){
			// 	this.centerX = newCenterX * -1;
			// 	this.direction.x *= -1;
			// } else if(newCenterX > this.canvas.width - this.radius){
			// 	this.centerX = (2 * this.canvas.width) - newCenterX;
			// 	this.direction.x *= -1;
			// } else {
			// 	this.centerX = newCenterX
			// }

			if(newCenterX < (0 - (2 * this.radius)) || newCenterX > this.canvas.width + (2 * this.radius)){
				var that = this;
				this.ballOutOfBounds = true;

				setTimeout(function(){
					that.centerX = that.startPoint.x;
					that.centerY = that.startPoint.y;
					that.ballOutOfBounds = false;
				}, 2000)
			} else if(this.ballHitsPaddle(newCenterX, newCenterY, paddlePos)){
				this.centerX = this.centerX - moveX;
				this.direction.x *= -1;
			} else {
				this.centerX = newCenterX
			}


			//redirects ball when it hits the edges of the y-axis by setting a new y coordinate
			if(!this.ballOutOfBounds){
				if(newCenterY < this.radius){
					this.centerY = newCenterY * -1
					this.direction.y *= -1;
				} else if(newCenterY > this.canvas.height - this.radius){
					this.centerY = (2 * this.canvas.height) - newCenterY;
					this.direction.y *= -1;
				} else {
					this.centerY = newCenterY;
				}
			}

			this.timePassed = 0;
		}
	}

	Ball.prototype.ballHitsPaddle = function (ballX, ballY, paddlePos) {
		if((ballX <= 20 + this.paddleDim.width) && (ballX >= 20) && (ballY >= paddlePos.y1) && (ballY <= paddlePos.y1 + this.paddleDim.height)){
			return true;
		} else if((ballX >= 600 - 20 - this.paddleDim.width) && (ballX <= 600 - 20) && (ballY >= paddlePos.y2) && (ballY <= paddlePos.y2 + this.paddleDim.height)){
			return true;
		} else {
			return false;
		}
	}

	Ball.prototype.render = function () {
		this.ctx.beginPath();
		this.ctx.fillStyle = "white";
		this.ctx.arc(
	    this.centerX,
	    this.centerY,
	    this.radius,
	    0,
	    2 * Math.PI,
	    false
	  );

		this.ctx.fill();


	}

	return Ball;

})
