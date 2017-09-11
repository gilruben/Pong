const uuidv4 = require('uuid/v4');

class RoomManager {
  constructor(io) {
    this.io = io;
    this.users = [];						//players
  	this.socketIds = [];
  	this.usersWaiting = [];		//players waiting for a game       MAY NOT BE NEEDED
  	this.roomsNotFull = [];		//rooms that haven't been filled
  	this.allFullRooms = [];		//filled rooms that are in use
  }

  joinRoom(socket) {
    socket.join('waiting');

    let rooms = this.io.sockets.adapter.rooms;
    let waitingRoom = rooms['waiting']
    let socketsInRoom = Object.keys(waitingRoom.sockets);

    console.log('Existing Rooms:', rooms)
    console.log(rooms['waiting'], 'player(s) in waiting room.');
    let target = this.io.sockets.connected[socketsInRoom[0]]
    // console.log('Target Socket:', target);
    console.log('Target Rooms:', target.rooms)

    if (socketsInRoom.length >= 2) {
      let player1 = socketsInRoom[0].leave('waiting')
      let player2 = socketsInRoom[1].leave('waiting')
      let possRoomId = uuidv4();

      let roomId = possRoomId in rooms ? uuidv4() : possRoomId

      player1.join(roomId);
      player2.join(roomId);

      this.io.to(roomId).emit('startGame', { left: player1.id, right: player2.id })
    }
  }
}

module.exports = RoomManager;
