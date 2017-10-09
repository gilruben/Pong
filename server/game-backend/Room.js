module.exports = (io) => {

  class Room {
    constructor(roomId) {
      this.io = io;
      this.id = roomId;
      this.room = io.sockets.in(roomId);
      this.players = {};
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

        // Place player instance in a room where the match will be held.
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

    setPlayerReady(playerId) {
      const { players } = this;
      const playersReady = 0;

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

      console.log('PLAYERS READY:', playersReady);
    }
  }


  return Room
}
