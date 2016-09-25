//function runServer(){
	var http = require('http');
	var fs = require('fs');
	var users = [];						//players
	var socketIds = [];
	var usersWaiting = [];		//players waiting for a game       MAY NOT BE NEEDED
	var roomsNotFull = [];		//rooms that haven't been filled
	var allFullRooms = [];		//filled rooms that are in use
	//var state = {};

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
		} else if(url === '/paddle.js'){
			fs.readFile('paddle.js', function(err, data){
				response.writeHead(200, {"Content-Type": "application/javascript"});
				response.write(data);
				response.end();
			})
		} else if(url === '/ball.js'){
			fs.readFile('ball.js', function(err, data){
				response.writeHead(200, {"Content-Type": "application/javascript"});
				response.write(data);
				response.end();
			})
		}else if(url === '/css/style.css'){
			fs.readFile('./css/style.css', function(err, data){
				response.writeHead(200, {"Content-Type": "text/css"});
				response.write(data);
				response.end();
			})
		} else{

		}
	})

	//socket.io
	var io = require("socket.io")(server);
	var port = Number(process.env.PORT || 3001)

	server.listen(port, function(){
		console.log('Listening on port ' + port + '.');
	});



	io.on('connection', function(socket){
	  var playerId = Math.floor(Math.random()*9000) + 1000;
		var room = null;
		var roomId = null;
		var state = {};

		function startMatch(){
			var moves = [];
			var roomClients = io.sockets.adapter.rooms[roomId].sockets;
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
			if(roomsNotFull.length === 0){
				roomId = Math.floor(Math.random()*900) + 100;

				//check if the room ID generated already exist
				while(roomsNotFull.indexOf(roomId) !== -1 || allFullRooms.indexOf(roomId) !== -1 ){
				  roomId = Math.floor(Math.random()*900) + 100;
				}

				roomsNotFull.push(roomId);
				console.log('Room ' + roomId + ' created.');
			} else {
				roomId = roomsNotFull[0];
				allFullRooms.push(roomsNotFull.shift());

				console.log('Rooms not full:  ' + roomsNotFull);
				console.log('Rooms full:  ' + allFullRooms);
			}

	  	socket.join(roomId.toString());
	  	usersWaiting.push(data.id);

	  	room = io.sockets.adapter.rooms[roomId];
		  console.log(room.length + ' players in room');

		  if(room.length === 2){
			  console.log('Starting Game');

			  //gives an array of all the sockets in roomId
			  var socketsInRoom = io.sockets.adapter.rooms[roomId].sockets
				//console.log('Sockets in room: ' + socketsInRoom)
		    io.to(roomId).emit('startGame', {left: Object.keys(socketsInRoom)[0], right: Object.keys(socketsInRoom)[1]})
			}
	  })

		socket.on('startMatch', function(){
			startMatch();
		})



	  socket.on('disconnect', function(){
	  	console.log('Player ID: ' + playerId + ' disconnected');

			var usersIndx = users.indexOf(playerId);
	  	users.splice(usersIndx, 1);

			//if user was disconnected and is still in usersWaiting array, remove them
			var usersWaitIndx = usersWaiting.indexOf(playerId);
			if(usersWaitIndx !== -1){
				usersWaiting.splice(usersWaitIndx, 1);
			}

			var fullRoomIndx = allFullRooms.indexOf(roomId);
			if(fullRoomIndx !== -1){
				allFullRooms.splice(fullRoomIndx, 1);
			}

			var notFullRoomIndx = roomsNotFull.indexOf(roomId);
			if(notFullRoomIndx !== -1){
				roomsNotFull.splice(notFullRoomIndx, 1);
			}

			socket.leave(roomId);
	  })
	});
//}
//runServer()
