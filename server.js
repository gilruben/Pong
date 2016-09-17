function runServer(){
	var http = require('http');
	var fs = require('fs');
	var users = [];				//players
	var socketIds = [];
	var usersWaiting = [];		//players waiting for a game

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

	  	var room = io.sockets.adapter.rooms['room'];
		console.log(room.length + ' players in room');

		if(room.length === 2){
			console.log('Starting Game');
			//console.log(socket.id);
			var socketsInRoom = io.sockets.adapter.rooms['room'].sockets
			//console.log(Object.keys(socketsInRoom)[0]);
			//var data = ()

			io.to('room').emit('startGame', {left: Object.keys(socketsInRoom)[0], right: Object.keys(socketsInRoom)[1]})
		}
	  })


	  socket.on('disconnect', function(){
	  	console.log('A Player disconnected. Player ID: ' + playerId);
	  	var indx = users.indexOf(playerId);
	  	users.splice(indx, 1);
	  })
	});
}
runServer()
