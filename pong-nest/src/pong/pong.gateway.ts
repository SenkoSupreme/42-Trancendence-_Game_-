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

class P1 {
	id = 0;
	x = 4;
	y = 0;
	width = 8;
	height = 100;
	colour = "#02CEFC";
	side = "left";
	points = 0;
	room = "";
}

class P2 {
	id = 0;
	x = 1264;
	y = 0;
	width = 8;
	height = 100;
	colour = '#ED006C';
	side = 'right';
	points = 0;
	room = "";
};

class BALL {
	x = 640;
	y = 350;
	dx = 4;
	dy = 4;
	rad = 10;
	speed = 10;
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
		// console.log(client.handshake.query);
		// client.on('join_game', data => {
		//   //client.to(data).emit('joined_game', data);
		//   client.join(data);
		//   console.log('joined game ' + data);`
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
		this.server.emit('PlayerDisconnected');
		clearInterval(intervalid);
		intervalid = null;
	}

	//QUEUE
	@SubscribeMessage('join_game')
	handleJoinGame(client: Socket) {
		i++;
		
		listOfPlayers.set(i, new P1);
		listOfPlayers.get(i).id = client.id;
		queue[i] = listOfPlayers.get(i).id;
		
		if (i % 2 !== 0) {
			const roomID = (queue[i] + "+" + "gameRoom").toString();
			listOfPlayers.get(i).room = roomID;
			client.join(roomID);
			this.server.to(roomID).emit('player1_update', listOfPlayers.get(i));
		}
		else if (i % 2 === 0) {
			const roomID = (queue[i - 1] + "+" + "gameRoom").toString();
			listOfPlayers.set(i, new P2);
			listOfPlayers.get(i).id = client.id;
			listOfPlayers.get(i).room = roomID;
			client.join(roomID);
			this.server.to(roomID).emit('player2_update', listOfPlayers.get(i));
			this.server.to(roomID).emit('START_GAME');
			const ball_instance = new BALL;
			intervalid = setInterval(() => {
				this.handleBallMovement(listOfPlayers.get(i - 1), listOfPlayers.get(i), ball_instance);
			}, 1000 / 60);
		}
		// console.table(listOfPlayers.get(i).room);
		// console.table(listOfPlayers);
		
		
			//delete player from queue if cancelled

	}

	//----------------------------------------------------------------------------
//fixed
// TO  BE   FIXED 
//   if (listOfPlayers.get(client.id).y < 620) {
//     listOfPlayers.get(client.id).y += 40;
//     this.server.to(listOfPlayers.get(client.id).room).emit('player_moved', listOfPlayers.get(client.id));
//   }
	// handle player movement 
	@SubscribeMessage('arrow_keyUP')
	handleArrowKeyUP(client: Socket) {
			let id:number;
			for (id of listOfPlayers.keys()) {
				if (listOfPlayers.get(id).id === client.id) {
					break;
				}
				else {
					continue;
				}
			}
			if (listOfPlayers.get(id).y > 0) {
				listOfPlayers.get(id).y -= 40;
				this.server.to(listOfPlayers.get(id).room).emit('player_moved', listOfPlayers.get(id));
			}
	}

	@SubscribeMessage('arrow_keyDown')
	handleArrowKeyDown(client: Socket) {
		let id:number;
		for (id of listOfPlayers.keys()) {
			if (listOfPlayers.get(id).id === client.id) {
				break;
			}
			else {
				continue;
			}
		}
		if (listOfPlayers.get(id).y < 620) {
			listOfPlayers.get(id).y += 40;
			console.log(listOfPlayers.get(id).room);
			this.server.to(listOfPlayers.get(id).room).emit('player_moved', listOfPlayers.get(id));
		}
	}

// END  OF  TO  BE   FIXED
//----------------------------------------------------------------------------

	handleBallMovement(player1: any, player2: any, ball_ins: any) {

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

		if (ball_ins.y < 0 || ball_ins.y + ball_ins.rad > 720) {
			ball_ins.dy = -ball_ins.dy;
		}
		if (ball_ins.x < 0) {
			if (player2.side === 'right') {
				player2.points = player2.points + 1;
				this.server.to(player2.room).emit('player2_scored', player2.points);
				if (player2.points === 10) {
					this.server.to(player2.room).emit('player2_won');
					//send player points here
					player2.points = 0;
					clearInterval(intervalid);
				}
			}
			ball_ins.x = 640;
			ball_ins.y = 350;
			ball_ins.dx = -4;
			ball_ins.dy = -4;
			//update score here
		}
		else if (ball_ins.x + ball_ins.rad > 1280) {
			if (player1.side === 'left') {
				player1.points = player1.points + 1;
				this.server.to(player1.room).emit('player1_scored', player1.points);
				if (player1.points === 10) {
					this.server.to(player1.room).emit('player1_won');
					//send player points here
					player1.points = 0;
					clearInterval(intervalid);
				}
			}
			ball_ins.x = 640;
			ball_ins.y = 350;
			ball_ins.dx = 4;
			ball_ins.dy = 4;
			//update score here
		}

		if ((collision(player1, ball_ins) && ball_ins.dx < 0)
			&& player1.side == 'left') {
			ball_ins.dx = -ball_ins.dx;
			this.server.to(player1.room).emit('play_sound');
		}

		if ((collision(player2, ball_ins) && ball_ins.dx > 0
			&& player2.side == 'right')
		) {
			ball_ins.dx = -ball_ins.dx;
			this.server.to(player2.room).emit('play_sound');

		}


		ball_ins.x += ball_ins.dx;
		ball_ins.y += ball_ins.dy;
		// console.log(ball_ins);
		
		this.server.to(player1.room).emit('ball_update', ball_ins);
		/*
		Ball emits exclusivly to player room
		Lost when another room is created - logic cuz its for just one room.
		Need to separate balls for each room.

		update :
		   --- there can be new balls created for each room
		   BUUUUT all balls appear in the same room lol
		*/
	}

}