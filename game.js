define(['paddle'], function (Paddle) {
  //Constructor
  function Game(width, height) {
    this.width = width;
    this.height = height;
    this.you = null;
    this.other = null;
    this.socket = null;
    this.canvas = null;
  }

  //creates the canvas where the game will take place
  Game.prototype.init = function(selfSide, oppSide, socket) {
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);

  	$('div').html(this.canvas);

  	document.addEventListener('keydown', this.handleKeyPress.bind(this), false);
    this.you = new Paddle(selfSide, this.canvas);
    //this.you.render();
    this.other = new Paddle(oppSide, this.canvas);
    //this.other.render();
  }

  Game.prototype.handleKeyPress = function(e) {
    e.preventDefault();

    var keycode = e.keyCode;
    // console.log(keycode);
    switch (keycode) {
      case 38:
        console.log('up');
        this.you.moveUp();
        break;
      case 40:
        console.log('down');
        this.you.moveDown();
        break;
    }

  }

  Game.prototype.start = function() {
    var ctx = this.canvas.getContext('2d');
    var that = this;

    function tick() {
      ctx.clearRect(0, 0, that.width, that.height);
      that.you.render();
      that.other.render();
    }

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick)
  }

  return Game;
});
