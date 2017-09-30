const BallLogic = require('./BallLogic');

class BallManager {
  constructor(radius, startX, startY, speed, paddleDim, canvasDim, roomManager) {
    this.radius = radius;
    this.startPoint = { x: startX, y: startY };
    this.speed = speed;
    this.paddleDim = paddleDim;
    this.canvasDim = canvasDim;
    this.roomManager = roomManager;
    this.balls = {};
  }

  createBall(roomId) {
    const startPoint = this.startPoint;

    this.balls[roomId] = {
      players: {},
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

  updatePlayerPos(gameRoomId, playerId, yPos) {
    this.balls[gameRoomId].players[playerId] = yPos;
  }

  getBallPosition(gameRoomId) {
    const ballPos = this.balls[gameRoomId].ball.position;

    return Object.assign({}, ballPos);
  }

  move(gameRoomId) {
    const ballData = this.balls[gameRoomId];
    const players = this.roomManager.getGameRoomPlayers(gameRoomId);
    const player1Id = players.player1.getId();
    const player2Id = players.player2.getId();

    // Y positions of the players
    const player1Y = ballData.players[player1Id];
    const player2Y = ballData.players[player2Id];

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

module.exports = BallManager;
