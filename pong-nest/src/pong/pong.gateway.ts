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
import { dirxml } from 'console';
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

const BALL = {
  x: 640,
  y: 350,
  dx: 4,
  dy: 4,
  rad: 10,
  speed: 10,
};

const listOfPlayers: Map<string, any> = new Map();

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
        //this.server.emit('room_full');
      }
      else {
        const player = Array.from(inroom.values());
        if(player[0]) {
        listOfPlayers.set(player[0], P1);
        listOfPlayers.get(player[0]).room = data;
        listOfPlayers.get(player[0]).id = client.id;
        this.server.emit('player1_update', listOfPlayers.get(player[0]));
        }
        if (player[1]) {
          listOfPlayers.set(player[1], P2);
          listOfPlayers.get(player[1]).room = data;
          listOfPlayers.get(player[1]).id = client.id;
          this.server.emit('player2_update', listOfPlayers.get(player[1]));
        }
        setInterval(() => {
          
        if (inroom.size === 2) {
          this.server.emit('START_GAME');
          this.handleBallMovement(client);
        }
      }, 1000 / 60);
      }
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
    this.server.emit('PlayerDisconnected');
  }

  // handle player movement
    @SubscribeMessage('arrow_keyUP')
    handleArrowKeyUP(client: Socket) {
      if (listOfPlayers.get(client.id).y > 0) {
        listOfPlayers.get(client.id).y -= 40;
        this.server.to(listOfPlayers.get(client.id).room).emit('player_moved', listOfPlayers.get(client.id));
      }
    }

    @SubscribeMessage('arrow_keyDown')
    handleArrowKeyDown(client: Socket) {
      if (listOfPlayers.get(client.id).y < 620) {
        listOfPlayers.get(client.id).y += 40;
        this.server.to(listOfPlayers.get(client.id).room).emit('player_moved', listOfPlayers.get(client.id));
      }
    }

  handleBallMovement(client: Socket) {
    
          //ball handle
          function collision(objPlayer: any, objBall: any) {
            if (
              objPlayer.x + objPlayer.width > objBall.x &&
              objPlayer.x < objBall.x + objBall.rad &&
              objPlayer.y + objPlayer.height > objBall.y &&
              objPlayer.y < objBall.y + objBall.rad)
            {
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
            if (listOfPlayers.get(client.id).side === 'right') {
              listOfPlayers.get(client.id).points = listOfPlayers.get(client.id).points + 1;
              this.server.to(listOfPlayers.get(client.id).room).emit('player2_scored', listOfPlayers.get(client.id).points);
              console.log("Player 2 scored", listOfPlayers.get(client.id).points, listOfPlayers.get(client.id).side, client.id);
            }
            BALL.x = 640;
            BALL.y = 350;
            BALL.dx = 4;
            BALL.dy = 4;
            //update score here
          }
          else if (BALL.x + BALL.rad > 1279) {
            if (listOfPlayers.get(client.id).side === 'left') {
              listOfPlayers.get(client.id).points = listOfPlayers.get(client.id).points + 1;
              this.server.to(listOfPlayers.get(client.id).room).emit('player1_scored', listOfPlayers.get(client.id).points);
              console.log("Player 1 scored", listOfPlayers.get(client.id).points, listOfPlayers.get(client.id).side, client.id);
            }
            BALL.x = 640;
            BALL.y = 350;
            BALL.dx = 4;
            BALL.dy = 4;
            //update score here
          }
      
          if ((collision(listOfPlayers.get(client.id), BALL) && BALL.dx > 0
            && listOfPlayers.get(client.id).side === 'right')
          ) {
            BALL.dx = -BALL.dx;
            console.log('collision P2');
          }
          if ((collision(listOfPlayers.get(client.id), BALL) && BALL.dx < 0)
            && listOfPlayers.get(client.id).side === 'left') {
            BALL.dx = -BALL.dx;
            console.log('collision P1');
          }
      
          
          BALL.x += BALL.dx;
          BALL.y += BALL.dy;
          // console.log('ball ' + BALL.dx + ' ' + BALL.dy);
            this.server.to(listOfPlayers.get(client.id).room).emit('ball_update', BALL);
  }

}