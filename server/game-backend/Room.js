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

        if (!numOfPlayers) {
          players['player1'] = player;
        } else if (numOfPlayers === 1) {
          players['player2'] = player;
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
      const { player1, player2 } = players;
      const roomId = this.id;
      let player;

      if (player1.getId() === playerId) {
        player = player1;
      } else if (player2.getId() === playerId) {
        player = player2;
      } else {
        return;
      }

      player.socket.leave(roomId);
      this.sigPlayerLeave(player);
      player.setGameRoomId(null)
    }

    sigPlayerLeave(player) {
      const { room, io, id } = this;
      const roomId = id;

      io.in(roomId).emit('player-leave', {
        playerId: player.getId()
      });
    }
  }

  return Room
}
