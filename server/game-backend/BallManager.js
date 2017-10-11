const BallLogic = require('./BallLogic');

class BallManager {
  constructor(radius, startX, startY, speed, paddleDim, canvasDim) {
    this.radius = radius;
    this.startPoint = { x: startX, y: startY };
    this.speed = speed;
    this.paddleDim = paddleDim;
    this.canvasDim = canvasDim;
    this.balls = {};
  }

  createBall(room) {
    const { startPoint, balls } = this;
    const roomId = room.id;

    balls[roomId] = {
      room,
      lastMoved: null,
      ball: new BallLogic(
        this.radius,
        startPoint.x,
        startPoint.y,
        this.speed,
        this.paddleDim,
        this.canvasDim
      )
    }
  }

  getBallPosition(gameRoomId) {
    const ballPos = this.balls[gameRoomId].ball.position;

    return Object.assign({}, ballPos);
  }

  move(gameRoomId) {
    const ballData = this.balls[gameRoomId];
    const players = ballData.room.getPlayers();
    const numOfPlayers = Object.keys(players).length;

    // Stop moving the ball if a player has left the room.
    if (numOfPlayers === 2) {
      // Y positions of the players
      const player1Y = players.player1.playerPosition;
      const player2Y = players.player2.playerPosition;

      if (!ballData.lastMoved) {
        ballData.lastMoved = new Date().getTime();
      }

      const timeNow = new Date().getTime();
      const timePassed = timeNow - ballData.lastMoved;
      const paddlePos = { y1: player1Y, y2: player2Y };

      ballData.ball.move(paddlePos, timePassed);
      ballData.lastMoved = timeNow;
    }
  }
}

module.exports = BallManager;
