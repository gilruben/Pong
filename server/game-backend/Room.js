module.exports = (io, roomManager, ballManager) => {

  class Room {
    constructor(roomId) {
      this.io = io;
      this.id = roomId;
      this.room = io.sockets.in(roomId);
      this.players = {};
      this.updateStopCode = 0;
    }

    join(...newPlayers) {
      const { players } = this;
      const roomId = this.id;


      newPlayers.forEach((player) => {
        const numOfPlayers = Object.keys(players).length;
        const playerData = {
          player,
          isReady: false
        }

        if (!numOfPlayers) {
          players['player1'] = playerData;
        } else if (numOfPlayers === 1) {
          players['player2'] = playerData;
        } else {
          throw Error('Room is full!');
        }

        // Place player instance in the room where the match will be held.
        player.socket.join(roomId);
        // Set gameRoomId on player instance.
        player.setGameRoomId(roomId);
      });
    }

    leave(playerId) {
      const { players, io, } = this;
      const roomId = this.id;

      for (let playerNum in players) {
        const { player } = players[playerNum];

        if (player.getId() === playerId) {
          player.socket.leave(roomId);
          this.sigPlayerLeave(player);
          player.setGameRoomId(null)

          delete players[playerNum];

          return;
        }
      }
    }

    sigPlayerLeave(player) {
      const { room, io, id } = this;
      const roomId = id;

      io.in(roomId).emit('player-leave', {
        playerId: player.getId()
      });
    }

    startGame() {
      const { players } = this;
      const gameRoomId = this.id;
      const player1 = players.player1.player;
      const player2 = players.player2.player;

      const player1Moves = [];
      const player2Moves = [];

      let p1LastMove;
      let p2LastMove;


      ballManager.createBall(this);

      player1.socket.on('move', function(data){
        player1.setPosition(data.y);
        p1LastMove = data.y;
        player1Moves.push(data.y);
      });

      player2.socket.on('move', function(data){
        player2.setPosition(data.y);
        p2LastMove = data.y;
        player2Moves.push(data.y);
      });


      // Update Interval.
      let stopCode = setInterval(function(){
        // Move the ball in room with id [gameRoomId].
        ballManager.move(gameRoomId);

        player1.socket.emit('update', {
          y: (player2Moves.length) ? player2Moves.shift() : p2LastMove,
          ballPosition: ballManager.getBallPosition(gameRoomId),
          ballRadius: ballManager.radius
        });

        player2.socket.emit('update', {
          y: (player1Moves.length) ? player1Moves.shift() : p1LastMove,
          ballPosition: ballManager.getBallPosition(gameRoomId),
          ballRadius: ballManager.radius
        });
      }, 17);
    }

    setPlayerReady(playerId) {
      const { players } = this;
      let playersReady = 0;

      for (let playerNum in players) {
        const playerData = players[playerNum];
        const playerIsReady = playerData.isReady;
        const { player } = playerData;

        if ((player.getId() === playerId) && !playerIsReady) {
          playerData.isReady = true;
          playersReady++;
        } else if (playerIsReady) {
          playersReady++;
        }
      }

      if (playersReady === 2) {
        this.startGame();
      }
    }

    getPlayers() {
      const { players } = this;
      const playersInRoom = {};

      for (let playerNum in players) {
        playersInRoom[playerNum] = players[playerNum].player;
      }

      return playersInRoom;
    }
  }


  return Room
}
