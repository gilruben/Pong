const uuidv4 = require('uuid/v4');

class RoomManager {
  constructor(io) {
    this.io = io;
  	this.waitingQueue = [];		//players waiting for a game
  }

  joinRoom(socket) {
    socket.join('waiting', () => {
      let waitingQueue = this.waitingQueue;
      waitingQueue.push(socket.id);

      // Object with all rooms (key: room-name, value: room-object).
      let rooms = this.io.sockets.adapter.rooms;
      let waitingRoom = rooms['waiting']

      console.log(waitingRoom.length + ' player(s) in waiting room.');

      // Object with all player sockets (key: socket-id, value: socket).
      let allConnPlayers = this.io.sockets.connected


      if (waitingQueue.length >= 2) {
        // Remove 2 players from waiting queue.
        let player1Id = waitingQueue.shift();
        let player2Id = waitingQueue.shift();

        // Remove selected players from waiting room.
        let player1 = allConnPlayers[player1Id].leave('waiting');
        let player2 = allConnPlayers[player2Id].leave('waiting');

        let possRoomId = uuidv4();
        let roomId = possRoomId in rooms ? uuidv4() : possRoomId

        // Place selected players in a room where the match will be held.
        player1.join(roomId);
        player2.join(roomId);

        this.io.to(roomId).emit('startGame', { left: player1Id, right: player2Id });
      }
    });

  }
}

module.exports = RoomManager;
