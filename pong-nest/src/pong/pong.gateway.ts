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
	id = 0;
	x = 640;
	y = 350;
	dx = 7;
	dy = 7;
	rad = 10;
	speed = 10;
};

const listOfPlayers: Map<number, any> = new Map();
let intervalid;
let i = 0;

const ballOfRoom: Map<string, any> = new Map();
const queue = Array<string>;

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log(`Client connected + ${client.id}`);
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
		}
		else if (i % 2 === 0) {
			const roomID = (queue[i - 1] + "+" + "gameRoom").toString();
			listOfPlayers.set(i, new P2);
			listOfPlayers.get(i).id = client.id;
			listOfPlayers.get(i).room = roomID;
			client.join(roomID);
			this.server.to(roomID).emit('player1_update', listOfPlayers.get(i  - 1));
			this.server.to(roomID).emit('player2_update', listOfPlayers.get(i));
			this.server.to(roomID).emit('START_GAME');
			ballOfRoom.set(roomID, new BALL);
			ballOfRoom.get(roomID).id = roomID;
			console.log(ballOfRoom.get(roomID).id);
			this.handleBallMovement(listOfPlayers.get(i - 1), listOfPlayers.get(i), ballOfRoom.get(roomID));
		}
		//delete player from queue if cancelled
	}

	//Cancel Queue
	@SubscribeMessage('cancelQueue')
	handleCancelQueue(client: Socket) {
		let id: number;
		for (id of listOfPlayers.keys()) {
			if (listOfPlayers.get(id).id === client.id) {
				break;
			}
			else {
				continue;
			}
		}
		listOfPlayers.delete(id);
		i--;
	}

	
	// handle player movement 
	@SubscribeMessage('arrow_keyUP')
	handleArrowKeyUP(client: Socket) {
		let id: number;
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
		let id: number;
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
			this.server.to(listOfPlayers.get(id).room).emit('player_moved', listOfPlayers.get(id));
		}
	}

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

		intervalid = setInterval(() => {

		if (player1.room === ball_ins.id) {
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
				ball_ins.dx = -7;
				ball_ins.dy = -7;
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
				ball_ins.dx = 7;
				ball_ins.dy = 7;
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

				this.server.sockets.to(player1.room).emit('ball_update', ball_ins);

			}
		}, 1000 / 60);
	}

}