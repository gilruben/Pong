const shortid = require('shortid');

class RoomManager {
  constructor(io) {
    this.io = io;
  	this.waitingQueue = [];		//players waiting for a game
    this.gameRooms = {};
  }

  joinRoom(player) {
    const { socket } = player;
    const { io } = this;

    socket.join('waiting', () => {
      let waitingQueue = this.waitingQueue;
      waitingQueue.push(player);

      // Object with all rooms (key: room-name, value: room-object).
      let rooms = this.io.sockets.adapter.rooms;
      let waitingRoom = rooms['waiting']

      console.log(waitingRoom.length + ' player(s) in waiting room.');


      if (waitingQueue.length >= 2) {
        // Remove 2 players from waiting queue.
        const player1 = waitingQueue.shift();
        const player2 = waitingQueue.shift();

        // Remove selected players from waiting room.
        player1.socket.leave('waiting');
        player2.socket.leave('waiting');


        let possRoomId = shortid.generate();
        let roomId = possRoomId in rooms ? shortid.generate() : possRoomId

        // Place selected players in a room where the match will be held.
        player1.socket.join(roomId);
        player2.socket.join(roomId);

        player1.setGameRoomId(roomId);
        player2.setGameRoomId(roomId);

        this.gameRooms[roomId] = {
          player1: player1,
          player2: player2
        };

        io.to(roomId).emit('startGame', {
          left: player1.getId(),
          right: player2.getId()
        });
      }
    });
  }

  getGameRoomPlayers(gameRoomId) {
    return this.gameRooms[gameRoomId];
  }
}

module.exports = RoomManager;
