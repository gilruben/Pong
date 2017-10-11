const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const RoomManager = require('./game-backend/RoomManager');
const Player = require('./game-backend/Player');

function runServer(){
	const app = express();
	const server = http.Server(app);
	const io = socketio(server);
	const roomManager = new RoomManager(io);
	const players = {};

	app.use(express.static(path.join(__dirname, '../src/bundle')));

	// Front-End Route
	app.get('/*', (req, res) => {
	  res.sendFile(path.join(__dirname, '../index.html'));
	});


	const port = process.env.PORT || 3001;


	server.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});


	io.on('connection', function(socket){
		console.log('A Player connected. Player ID: ' +  socket.id);


	  socket.on('waiting', function(){
			const player = new Player(socket);
			players[socket.id] = player;

			roomManager.joinRoom(player);
	  })

		socket.on('ready', () => {
			const playerId = socket.id;
			const player = players[playerId];
			const { gameRoomId } = player;

			roomManager.setPlayerReady(gameRoomId, playerId);
		});

		socket.on('disconnecting', () => {
			const playerId = socket.id;
			const player = players[playerId];

			if (player) {
				roomManager.leaveRoom(player.gameRoomId, playerId);

				// Remove player from the players object.
				delete players[playerId];
			}
		});

	  socket.on('disconnect', function(){
	  	console.log('Player ID: ' + socket.id + ' disconnected');
	  });
	});
}
runServer()
