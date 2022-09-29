/* eslint-disable prettier/prettier */
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

const P1 = {
	id: 0,
	x: 4,
	y: 0,
	width: 8,
	height: 100,
	colour: "#02CEFC",
	side: "left",
	points: 0,
	room: "",
};
const P2 = {
	id: 0,
	x: 1264,
	y: 0,
	width: 8,
	height: 100,
	colour: '#ED006C',
	side: 'right',
	points: 0,
	room: "",
};

const BALL = {
	x: 640,
	y: 350,
	dx: 8,
	dy: 8,
	rad: 10,
	speed: 10,
};

const listOfPlayers: Map<number, any> = new Map();
let intervalid;
let i = 0;
const queue = Array<string>;

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;


	handleConnection(client: Socket) {
		console.log(`Client connected + ${client.id}`);
		i++;
		listOfPlayers.set(i, P1);
		listOfPlayers.get(i).id = client.id;
		queue[i] = listOfPlayers.get(i).id;
		// client.on('join_game', data => {
		//   //client.to(data).emit('joined_game', data);
		//   client.join(data);
		//   console.log('joined game ' + data);
		//   const inroom = this.server.sockets.adapter.rooms.get(data);


		//   if (inroom.size > 2) {
		//     console.log('room full');
		//     //this.server.emit('room_full');
		//   }
		//   else {
		//       const player = Array.from(inroom.values());
		//       if(i === 0) {
		//       listOfPlayers.set(player[0], P1);
		//       listOfPlayers.get(player[0]).room = data;
		//       listOfPlayers.get(player[0]).id = client.id;
		//       console.log('player1 ' , listOfPlayers.get(player[0]));
		//       i++;
		//    }
		//     if (i === 1) {
		//       listOfPlayers.set(player[1], P2);
		//       listOfPlayers.get(player[1]).room = data;
		//         listOfPlayers.get(player[1]).id = client.id;
		//       }
		//       i = 0;
		//     if (inroom.size === 2) {
		//       this.server.to(data).emit('START_GAME');
		//       this.server.to(data).emit('player1_update', listOfPlayers.get(player[0]));
		//       this.server.to(data).emit('player2_update', listOfPlayers.get(player[1]));
		//         intervalid =  setInterval(() => {
		//             this.handleBallMovement(listOfPlayers.get(player[0]), listOfPlayers.get(player[1]))}, 1000 / 80);
		//       }
		//     else if (inroom.size === 1) {
		//       this.server.emit('WAITING_FOR_PLAYER');
		//       clearInterval(intervalid);
		//       if (player[0]) listOfPlayers.set(player[0], P1);
		//       if(player[1]) listOfPlayers.set(player[1], P2);
		//     }
		//   }
		// });
	}

	handleDisconnect(client: Socket) {
		console.log('Client disconnected ' + client.id);
		listOfPlayers.delete(i);
		console.clear();
		i--;
		clearInterval(intervalid);
		this.server.emit('PlayerDisconnected');
		P1.points = 0;
		P2.points = 0;
	}

	//QUEUE
	@SubscribeMessage('join_game')
	handleJoinGame(client: Socket) {
		const roomID = (queue[i] + "+" + "gameRoom").toString();
		client.join(roomID);
		listOfPlayers.get(i).room = roomID;
		console.log('QUEUE ' + roomID);
		console.log(listOfPlayers.get(i));
		console.log("----------------------");

		//client.to(roomID[0]).emit('START_GAME');
	}

//----------------------------------------------------------------------------


// handle player movement 
// @SubscribeMessage('arrow_keyUP')
// handleArrowKeyUP(client: Socket) {
//   if (listOfPlayers.get(client.id).y > 0) {
//     listOfPlayers.get(client.id).y -= 40;
//     this.server.to(listOfPlayers.get(client.id).room).emit('player_moved', listOfPlayers.get(client.id));
//   }
// }

// @SubscribeMessage('arrow_keyDown')
// handleArrowKeyDown(client: Socket) {
//   if (listOfPlayers.get(client.id).y < 620) {
//     listOfPlayers.get(client.id).y += 40;
//     this.server.to(listOfPlayers.get(client.id).room).emit('player_moved', listOfPlayers.get(client.id));
//   }
// }

handleBallMovement(player1: any, player2: any) {

	//ball handle
	function collision(objPlayer: any, objBall: any) {
		if (
			objPlayer.x + objPlayer.width > objBall.x &&
			objPlayer.x < objBall.x + objBall.rad &&
			objPlayer.y + objPlayer.height > objBall.y &&
			objPlayer.y < objBall.y + objBall.rad) {
			return true;
		}
		else {
			return false;
		}
	}

	if (BALL.y < 0 || BALL.y + BALL.rad > 720) {
		BALL.dy = -BALL.dy;
	}
	if (BALL.x < 0) {
		if (player2.side === 'right') {
			player2.points = player2.points + 1;
			this.server.to(player2.room).emit('player2_scored', player2.points);
			console.log("Player 2 scored", player2.points, player2.side);
			if (player2.points === 10) {
				this.server.to(player2.room).emit('player2_won');
				//send player points here
				player2.points = 0;
				console.log("Player 2 won");
				clearInterval(intervalid);
			}
		}
		BALL.x = 640;
		BALL.y = 350;
		BALL.dx = -8;
		BALL.dy = -8;
		//update score here
	}
	else if (BALL.x + BALL.rad > 1280) {
		if (player1.side === 'left') {
			player1.points = player1.points + 1;
			this.server.to(player1.room).emit('player1_scored', player1.points);
			console.log("Player 1 scored", player1.points, player1.side);
			if (player1.points === 10) {
				this.server.to(player1.room).emit('player1_won');
				//send player points here
				player1.points = 0;
				console.log("Player 1 won");
				clearInterval(intervalid);
			}
		}
		BALL.x = 640;
		BALL.y = 350;
		BALL.dx = 8;
		BALL.dy = 8;
		//update score here
	}

	if ((collision(player1, BALL) && BALL.dx < 0)
		&& player1.side == 'left') {
		BALL.dx = -BALL.dx;
		console.log('collision P1');
		this.server.to(player1.room).emit('play_sound');
	}

	if ((collision(player2, BALL) && BALL.dx > 0
		&& player2.side == 'right')
	) {
		BALL.dx = -BALL.dx;
		console.log('collision P2');
		this.server.to(player2.room).emit('play_sound');

	}


	BALL.x += BALL.dx;
	BALL.y += BALL.dy;
	this.server.to(player1.room).emit('ball_update', BALL);
}

}