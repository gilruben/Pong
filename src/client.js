import io from 'socket.io-client';
import Game from './game/game.js';
import '../css/style.css';

const socket = io();

$('#play').on('click', function(){
	$('div').html('<h1>Waiting for player...<h1>');
	socket.emit('waiting');
})


socket.on('startGame', function(data){
	$('div').html('<h1>Starting game<h1>');
	let pongGame = new Game(600, 400);
	console.log(data)

	//if the id of the socket is equal to the id in data.left then the
	//current player's paddle will be placed on the left side
	if((socket.id) === data.left){
		pongGame.init(1, 2, socket);
		//console.log(pongGame)
		// console.log('socketID: ' + socket.id);
		// console.log("On the left side id: " + data.left);
	} else {
		pongGame.init(2, 1, socket);
		// console.log('socketID: ' + socket.id);
		// console.log("On the right side id: " + data.right);
	}


	pongGame.start();

})

socket.on('player-leave', (data) => {
	let opponentId = data.playerId;
	console.log(`${opponentId} has left the room`);
});
