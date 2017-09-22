const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const RoomManager = require('./RoomManager');
const BallManager = require('./BallManager');

function runServer(){
	const app = express();
	const server = http.Server(app);
	const io = socketio(server);
	const canvasDim = { width: 600, height: 400 };
	const canvasWidth = canvasDim.width;
	const canvasHeight = canvasDim.height;
	const paddleDim = { width: 30, height: 100 };
	const roomManager = new RoomManager(io);
	const ballManager = new BallManager(10, canvasWidth/2, canvasHeight/2, 500, paddleDim, canvasDim, roomManager);


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

			let player1Id = roomManager.getGameRoomPlayers(gameRoomId).player1;

			// If player is player1, create the ball for the game
			if (socketId === player1Id) {
				ballManager.createBall(gameRoomId);
			}

			socket.on('move', function(data){
				ballManager.updatePlayerPos(gameRoomId, socketId, data.y);
				lastOppMove = data.y;
				moves.push(data.y);
			});

			let stopCode = setInterval(function(){
				// Move the ball in room with id gameRoomId.
				ballManager.move(gameRoomId);

				opp.emit('update', {
					y: (moves.length) ? moves.shift() : lastOppMove,
				  ballPosition: ballManager.getBallPosition(gameRoomId),
					ballRadius: ballManager.radius
				});
			}, 17);
		}



	  socket.on('waiting', function(){
			roomManager.joinRoom(socket)
	  })


		socket.on('startMatch', startMatch);


	  socket.on('disconnect', function(){
	  	console.log('Player ID: ' + socket.id + ' disconnected');
	  });
	});
}
runServer()
