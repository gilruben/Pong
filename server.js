function runServer(){
	var http = require('http');
	var fs = require('fs');
	var users = [];				//players
	var socketIds = [];
	var usersWaiting = [];		//players waiting for a game
	var state = {};

	var server = http.createServer(function(request, response){
		var url = request.url;

		if(url === '/'){
			fs.readFile('index.html', function(err, data){
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write(data);
				response.end();
			})
		} else if(url === '/client.js'){
			fs.readFile('client.js', function(err, data){
				response.writeHead(200, {"Content-Type": "application/javascript"});
				response.write(data);
				response.end();
			})
		} else if(url === '/game.js'){
			fs.readFile('game.js', function(err, data){
				response.writeHead(200, {"Content-Type": "application/javascript"});
				response.write(data);
				response.end();
			})
		} else if(url === '/require.js'){
			fs.readFile('require.js', function(err, data){
				response.writeHead(200, {"Content-Type": "application/javascript"});
				response.write(data);
				response.end();
			})
		} else if(url === '/main.js'){
			fs.readFile('main.js', function(err, data){
				response.writeHead(200, {"Content-Type": "application/javascript"});
				response.write(data);
				response.end();
			})
		} else if(url === '/paddle.js'){
			fs.readFile('paddle.js', function(err, data){
				response.writeHead(200, {"Content-Type": "application/javascript"});
				response.write(data);
				response.end();
			})
		} else if(url === '/style.css'){
			fs.readFile('style.css', function(err, data){
				response.writeHead(200, {"Content-Type": "text/css"});
				response.write(data);
				response.end();
			})
		}
	})

	var io = require("socket.io")(server);

	server.listen(3001, function(){
		console.log('Listening on port 3001.');
	});



	io.on('connection', function(socket){
	  var playerId = Math.floor(Math.random()*9000) + 1000;
		var room = null;
		var state = {};

		function startMatch(){
			var moves = [];
			var roomClients = io.sockets.adapter.rooms['room'].sockets;
			var socketId = socket.id;
			var oppId = Object.keys(roomClients).filter(function(id){
				return id !== socketId;
			})[0];
			//var state[oppId] = [];
			var opp = socket.server.clients().sockets[oppId];


			//when user starts match, remove user from usersWaiting array
			var usersWaitIndx = usersWaiting.indexOf(playerId);
			usersWaiting.splice(usersWaitIndx, 1);
			console.log('Player ID: ' + playerId + ' no longer waiting')

			//console.log('User Waiting: ' + usersWaiting);
			//console.log(oppId)
			//console.log(Object.keys(roomClients));
			//console.log(socketId);

			socket.on('move', function(data){
				moves.push(data.y)
				//opp.emit('update', {stuff: "hello"});
			})

			var stopCode = setInterval(function(){
				opp.emit('update', {y: (moves.length === 1) ? moves[0] : moves.shift()});
			}, 45);

			// socket.on('play', function(data){
			// 	moves.push(data.y)
			// 	//opp.emit('update', {stuff: "hello"});
			// })
		}


	  //give new player an id that isn't take
	  while(users.indexOf(playerId) !== -1){
	  	playerId = Math.floor(Math.random()*9000) + 1000;
	  }
	  users.push(playerId); //add id to users array

	  console.log('A Player connected. Player ID: ' +  playerId);

	  socket.on('play', function(){
	  	socket.emit('assignId', {id: playerId})
	  	console.log(users)
	  })


	  //event listener for when player is waiting for a game
	  socket.on('waiting', function(data){
	  	socket.join('room')
	  	usersWaiting.push(data.id);

	  	room = io.sockets.adapter.rooms['room'];
		  console.log(room.length + ' players in room');

		  if(room.length === 2){
			  console.log('Starting Game');

			  //gives an array of all the sockets in 'room'
			  var socketsInRoom = io.sockets.adapter.rooms['room'].sockets

		    io.to('room').emit('startGame', {left: Object.keys(socketsInRoom)[0], right: Object.keys(socketsInRoom)[1]})
			}
	  })

		socket.on('startMatch', function(){
			startMatch();
		})



	  socket.on('disconnect', function(){
	  	console.log('A Player disconnected. Player ID: ' + playerId);
	  	var usersIndx = users.indexOf(playerId);
	  	users.splice(usersIndx, 1);

			//if user was disconnected and is still in usersWaiting array, remove them
			var usersWaitIndx = usersWaiting.indexOf(playerId);
			if(usersWaitIndx !== -1){
				usersWaiting.splice(usersWaitIndx, 1);
			}

			socket.leave('room');
	  })
	});
}
runServer()
