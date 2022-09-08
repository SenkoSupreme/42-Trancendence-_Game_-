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
  dx: 6,
  dy: 6,
  rad: 10,
  speed: 10,
};

const listOfPlayers: Map<string, any> = new Map();
let intervalid;
let i = 0;

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
        if(i === 0) {
        listOfPlayers.set(player[0], P1);
        listOfPlayers.get(player[0]).room = data;
        listOfPlayers.get(player[0]).id = client.id;
        console.log('player1 ' , listOfPlayers.get(player[0]));
      }
      if (i === 1) {
        listOfPlayers.set(player[1], P2);
        listOfPlayers.get(player[1]).room = data;
          listOfPlayers.get(player[1]).id = client.id;
          i = 0;
        }
        i++;
        if (inroom.size === 2) {
          this.server.emit('START_GAME');
          this.server.emit('player1_update', listOfPlayers.get(player[0]));
          this.server.emit('player2_update', listOfPlayers.get(player[1]));
          // listOfPlayers.forEach((value, key) => {
            //   console.log(listOfPlayers.get(key)); }); 
            intervalid =  setInterval(() => {
                this.handleBallMovement(listOfPlayers.get(player[0]), listOfPlayers.get(player[1]))}, 1000 / 60);
          }
        else if (inroom.size === 1) {
          this.server.emit('WAITING_FOR_PLAYER');
          clearInterval(intervalid);
        }
      }
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
    clearInterval(intervalid);
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

  handleBallMovement(player1: any, player2: any) {
    
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
            if (player2.side === 'right') {
              player2.points = player2.points + 1;
              this.server.to(player2.room).emit('player2_scored', player2.points);
              console.log("Player 2 scored", player2.points, player2.side);
            }
            BALL.x = 640;
            BALL.y = 350;
            BALL.dx = 6;
            BALL.dy = 6;
            //update score here
          }
          else if (BALL.x + BALL.rad > 1280) {
            if (player1.side === 'left') {
              player1.points = player1.points + 1;
              this.server.to(player1.room).emit('player1_scored', player1.points);
              console.log("Player 1 scored", player1.points, player1.side);
            }
            BALL.x = 640;
            BALL.y = 350;
            BALL.dx = 6;
            BALL.dy = 6;
            //update score here
          }
      
          if ((collision(player1, BALL) && BALL.dx < 0)
            && player1.side == 'left') {
            BALL.dx = -BALL.dx;
            console.log('collision P1');
          }
          
          if ((collision(player2, BALL) && BALL.dx > 0
            && player2.side == 'right')
          ) {
            BALL.dx = -BALL.dx;
            console.log('collision P2');
          }
      
          
          BALL.x += BALL.dx;
          BALL.y += BALL.dy;
          // console.log('ball ' + BALL.dx + ' ' + BALL.dy);
            this.server.to(player1.room).emit('ball_update', BALL);
  }

}