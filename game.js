define(['paddle'], function (Paddle) {
  //Constructor
  function Game(width, height) {
    this.width = width;
    this.height = height;
    this.you = null;
    this.other = null;
    this.socket = null;
    this.canvas = null;
    this.lastY = 20;
  }

  //creates the canvas where the game will take place
  Game.prototype.init = function(selfSide, oppSide, socket) {
    this.socket = socket;
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
    var that = this;
    var ctx = this.canvas.getContext('2d');

    this.socket.on('update', function(data){
       //console.log(data.y)
       if(data.y !== undefined) that.other.y = data.y;
       console.log(data.y)
    })

    this.socket.emit('startMatch');

    function tick(){
      ctx.clearRect(0, 0, that.width, that.height);
      that.you.render();
      that.other.render();

      if(that.you.y !== that.lastY){
        that.lastY = that.you.y
        that.socket.emit('move', {y: that.lastY});
      }
    }


    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick)
  }

  return Game;
});
