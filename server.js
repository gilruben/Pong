const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const RoomManager = require('./RoomManager');

function runServer(){
	const app = express();
	const server = http.Server(app);
	const io = socketio(server);
	const roomManager = new RoomManager(io);


	app.use(express.static(path.join(__dirname, './src/bundle')));

	// Front-End Route
	app.get('/*', (req, res) => {
	  res.sendFile(path.join(__dirname, './index.html'));
	});


	const port = process.env.PORT || 3001;


	server.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});


	io.on('connection', function(socket){
		console.log('A Player connected. Player ID: ' +  socket.id);

		function startMatch() {
			let socketId = socket.id;
			let gameRoomId = Object.keys(socket.rooms).filter((id) => id !== socketId)[0];

			let moves = [];
			let playersInRoom = io.sockets.adapter.rooms[gameRoomId].sockets;
			let oppId = Object.keys(playersInRoom).filter((id) => id !== socketId)[0];
			let opp = io.sockets.connected[oppId];
			let lastOppMove;

			socket.on('move', function(data){
				lastOppMove = data.y;
				moves.push(data.y);
			});

			let stopCode = setInterval(function(){
				opp.emit('update', { y: (moves.length) ? moves.shift() : lastOppMove });
			}, 45);
		}



	  socket.on('waiting', function(){
			roomManager.joinRoom(socket)
	  })


		socket.on('startMatch', startMatch);


	  socket.on('disconnect', function(){
	  	console.log('Player ID: ' + socket.id + ' disconnected');

			// var usersIndx = users.indexOf(playerId);
	  	// users.splice(usersIndx, 1);
			//
			// //if user was disconnected and is still in usersWaiting array, remove them
			// var usersWaitIndx = usersWaiting.indexOf(playerId);
			// if(usersWaitIndx !== -1){
			// 	usersWaiting.splice(usersWaitIndx, 1);
			// }
			//
			// var fullRoomIndx = allFullRooms.indexOf(roomId);
			// if(fullRoomIndx !== -1){
			// 	allFullRooms.splice(fullRoomIndx, 1);
			// }
			//
			// var notFullRoomIndx = roomsNotFull.indexOf(roomId);
			// if(notFullRoomIndx !== -1){
			// 	roomsNotFull.splice(notFullRoomIndx, 1);
			// }
			//
			// socket.leave(roomId);
	  })
	});
}
runServer()
