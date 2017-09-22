class BallLogic {
  constructor(radius, startX, startY, speed, paddleDim, canvasDim) {
    this.radius = radius;
    this.position = { x: startX, y: startY };
    this.startPoint = { x: startX, y: startY };
    this.speed = speed;
    this.direction = {x: -1, y: 1};
    this.paddleDim = paddleDim;
    this.canvasDim = canvasDim;
    this.timePassed = 0;
    this.lastTimeMoved;
    this.ballOutOfBounds = false;
  }

  ballHitsPaddle(ballX, ballY, paddlePos) {
  	let isTouchingLeftPaddle = (ballX <= (20 + this.paddleDim.width)) && (ballX >= 20) && (ballY >= paddlePos.y1) && (ballY <= (paddlePos.y1 + this.paddleDim.height));
  	let isTouchingRightPaddle = (ballX >= (600 - 20 - this.paddleDim.width)) && (ballX <= 600 - 20) && (ballY >= paddlePos.y2) && (ballY <= (paddlePos.y2 + this.paddleDim.height));

  	return isTouchingLeftPaddle || isTouchingRightPaddle;
  }

  // Moves the ball.
  // paddlePos is an object that stores where the paddles are in the y-axis.
  // timePassed is a number representing how many milliseconds have passed since
  // the last tick.
  move(paddlePos, timePassed) {
  	this.timePassed += timePassed;

  	if(this.timePassed >= 1000/this.speed){
      let canvasDim = this.canvasDim;
      let paddleDim = this.paddleDim;
  		let moveX;
  		let moveY;
  		let newX;
  		let newY;

  		if(!this.ballOutOfBounds){
  			// How much to move x coordinate and y coordinate.
  			moveX = this.direction.x * Math.round(this.timePassed / (1000/this.speed));
  			moveY = this.direction.y * Math.round(this.timePassed / (1000/this.speed));

  			// New x and y if the previous center were to move moveX amount or moveY amount respectively.
  			newX = moveX + this.position.x;
  			newY = moveY + this.position.y;
  		}


  		if(newX < (0 - (2 * this.radius)) || newX > canvasDim.width + (2 * this.radius)){
  			let that = this;
  			this.ballOutOfBounds = true;

  			// Wait 2 seconds before serving the ball.
  			setTimeout(function(){
  				that.position.x = that.startPoint.x;
  				that.position.y = that.startPoint.y;
  				that.ballOutOfBounds = false;
  			}, 2000);
  		} else if(this.ballHitsPaddle(newX, newY, paddlePos)){
  			let canvasWidth = canvasDim.width;
  			let paddWidth = paddleDim.width;

  			// Distance beginning of the canvas to the right side of the left paddle.
  			let leftPaddDist = 20 + paddWidth;
  			// Distance from the left side of the right paddle to the end of the canvas.
  			let rightPaddDist = canvasWidth - 20 - paddWidth

  			// Chooses LeftPaddDist or rightPaddDist depending on which direction the
  			// ball is currently headed.
  			let contactPaddDist = (this.direction.x === -1) ? leftPaddDist : rightPaddDist;

  			// Where the ball will be after it has bounced off the paddle
  			moveX = (-1 * moveX) - (this.position.x - contactPaddDist);

  			this.position.x += moveX;
  			this.direction.x *= -1;
  		} else {
  			this.position.x = newX
  		}


  		// Redirects ball when it hits the edges of the y-axis by setting a new y coordinate
  		if(!this.ballOutOfBounds){
  			if(newY < this.radius){
  				this.position.y = newY * -1
  				this.direction.y *= -1;
  			} else if(newY > canvasDim.height - this.radius){
  				this.position.y = (2 * canvasDim.height) - newY;
  				this.direction.y *= -1;
  			} else {
  				this.position.y = newY;
  			}
  		}

  		// Reset time passed
  		this.timePassed = 0;
  	}
  }


};

module.exports = BallLogic;
