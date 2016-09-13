module.exports = {

	function Game(width, height) {
		//var pongPaddle = require('paddle.js');
		this.width = width;
		this.height = height;
		this.you = null;
		this.other = null;
		this.socket = null;
		this.canvas = null;
	}


	Game.prototype.init(selfSide, oppSide, socket) = function (){
		var canvas = document.createElement('canvas');
		canvas.addEvenListener('keydown', handleKeyPress);
		canvas.setAttribute('width', this.width);
		canvas.setAttribute('height', this.height);

		$('div').html(canvas);
		
		//this.you = new Paddle(selfSide);
		//this.other = new Paddle(oppSide);
	}

	Game.prototype.handleKeyPress = function(e){
		e.preventDefault;

		var keycode = e.keycode;

		switch(keycode) {
			case 38:
				console.log('up');
				//you.moveUp();
				break;
			case 40: 
				console.log('down');
				//you.moveDown();
				break;
		}

	}

	//Game
}