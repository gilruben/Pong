const shortid = require('shortid');

class RoomManager {
  constructor(io) {
    this.io = io;
  	this.waitingQueue = [];		//players waiting for a game
    this.gameRooms = {};
    this.Room = require('./Room')(io);
  }

  joinRoom(player) {
    const { socket } = player;
    const { io } = this;

    socket.join('waiting', () => {
      let waitingQueue = this.waitingQueue;
      waitingQueue.push(player);

      // Object with all rooms (key: room-name, value: room-object).
      let rooms = io.sockets.adapter.rooms;
      let waitingRoom = rooms['waiting']

      console.log(waitingRoom.length + ' player(s) in waiting room.');


      if (waitingQueue.length >= 2) {
        const { Room } = this;

        // Remove 2 players from waiting queue.
        const player1 = waitingQueue.shift();
        const player2 = waitingQueue.shift();

        // Remove selected players from waiting room.
        player1.socket.leave('waiting');
        player2.socket.leave('waiting');

        let possRoomId = shortid.generate();
        let roomId = possRoomId in rooms ? shortid.generate() : possRoomId

        const room = new Room(roomId);
        room.join(player1, player2);
        
        this.gameRooms[roomId] = room;


        io.to(roomId).emit('startGame', {
          left: player1.getId(),
          right: player2.getId()
        });
      }
    });
  }

  leaveRoom(gameRoomId, playerId) {
    const gameRoom = this.gameRooms[gameRoomId];

    gameRoom.leave(playerId);
  }

  getGameRoomPlayers(gameRoomId) {
    return this.gameRooms[gameRoomId].players;
  }
}

module.exports = RoomManager;
