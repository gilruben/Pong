class Player {
  constructor(socket) {
    this.socket = socket;
    this.gameRoomId = null;
    this.playerNumber = 0;
    this.playerPosition = null;
  }

  setGameRoomId(gameRoomId) {
    this.gameRoomId = gameRoomId;
  }

  setPlayerNumber(number) {
    if (typeof number !== 'number') {
      throw new TypeError('Argument must be a number.');
    } else if (number !== 0 || number !== 1 || number !== 2) {
      throw new Error('Argument must be 0, 1, or 2');
    } else {
      this.playerNumber = number;
    }
  }

  getId() {
    return this.socket.id;
  }

  setPosition(position) {
    if (!Number.isInteger(position)) {
      throw new TypeError('position must be an integer');
    } else if (position < 0) {
      throw new RangeError('position can not be negative');
    } else {
      this.playerPosition = position;
    }
  }

}

module.exports = Player;
