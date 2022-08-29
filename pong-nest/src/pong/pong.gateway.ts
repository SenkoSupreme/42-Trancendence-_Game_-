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
  width: 10,
  height: 100,
  colour: "#f9e076",
  side: "left",
  points: 0,
  room: "",
};
const P2 = {
  id: 0,
  x: 1264,
  y: 0,
  width: 10,
  height: 100,
  colour: '#9e2626',
  side: 'right',
  points: 0,
  room: "",
};

const listOfPlayers:Map<string, any> = new Map();

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  handleConnection(client: Socket) {
    console.log(`Client connected + ${client.id}`);
    client.on('join_game', data => {
      client.join(data);
    //client.to(data).emit('joined_game', data);
	console.log('joined game ' + data);
	const inroom = this.server.sockets.adapter.rooms.get(data);
	if (inroom.size > 2) {
		console.log('room full');
		//client.emit('room_full');
	}
	else {
		for (const user of inroom) {
		
			console.log(user);
		}
		this.server.emit('START_GAME'); 
	}
	});
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
    this.server.emit('PlayerDisconnected');
  }

  //NEW PLAYER HANDLER
  @SubscribeMessage('update')
  handleNewPlayer(client: Socket) {
	//
  }

  //handle player movement
//   @SubscribeMessage('arrow_keyUP')
//   handleArrowKeyUP(client: Socket) {
//     if (listOfPlayers.get(client.id).y > 0) {
//       listOfPlayers.get(client.id).y -= 40;
//       // console.log(
//       //   listOfPlayers.get(client.id).id + ' ' +
//       //      listOfPlayers.get(client.id).side + ' ' + 
//       //     listOfPlayers.get(client.id).y);
//       this.server.emit('player_moved', listOfPlayers.get(client.id));
//     }
//   }

//   @SubscribeMessage('arrow_keyDown')
//   handleArrowKeyDown(client: Socket) {
//     if (listOfPlayers.get(client.id).y < 620) {
//       listOfPlayers.get(client.id).y += 40;
//       console.log(
//         listOfPlayers.get(client.id).id + ' ' + 
//        listOfPlayers.get(client.id).side + ' ' + 
//        listOfPlayers.get(client.id).room + ' ' + 
//       listOfPlayers.get(client.id).y);
//       this.server.emit('player_moved', listOfPlayers.get(client.id));
//     }
//   }

  //Hadle ball logic
  @SubscribeMessage('ball_init')
  handleBallUpdate(client: Socket, data: any) {
    function collision(objPlayer: any, objBall: any) {
      if (
        objPlayer.x + objPlayer.width > objBall.x &&
        objPlayer.x < objBall.x + objBall.rad &&
        objPlayer.y + objPlayer.height > objBall.y &&
        objPlayer.y < objBall.y + objBall.rad) 
        // if (ball.x < player.x + player.w &&
        //   ball.x + ball.w > player.x &&
        //   ball.y < player.y + player.h &&
        //   ball.h + ball.y > player.y) {
        {
          return true;
        } 
        else 
        {
          return false;
        }
    }

    if (data.y < 0 || data.y + data.rad > 720) {
      data.dy = -data.dy;
    }
    if (data.x < 0) {
      listOfPlayers.get(client.id).points++;
      this.server.emit('player2_scored', listOfPlayers.get(client.id));
      //this.server.off('player2_scored', listOfPlayers.get(client.id));
      console.log("Player 2 scored");

      data.x = 640;
      data.y = 350;
      //update score here
      
    }
    if (data.x + data.rad > 1280) {
      listOfPlayers.get(listOfPlayers.keys().next().value).points++;
      this.server.emit('player1_scored', listOfPlayers.get(listOfPlayers.keys().next().value));
      //this.server.off('player2_scored', listOfPlayers.get(client.id));
      console.log("Player 1 scored");
      
      data.x = 640;
      data.y = 350;
      //update score here
    }

    if ((collision(listOfPlayers.get(client.id), data) && data.dx > 0 
        && listOfPlayers.get(client.id).side === 'right') 
    ) {
      data.dx = -data.dx;
      console.log('collision P2');
    }
    if ((collision(listOfPlayers.get(client.id), data) && data.dx < 0)
        && listOfPlayers.get(client.id).side === 'left')
    {
      data.dx = -data.dx;
      console.log('collision P1');
    }


    data.x += data.dx;
    data.y += data.dy;
   // console.log('ball ' + data.dx + ' ' + data.dy);
    this.server.emit('ball_update', data);
  }
}