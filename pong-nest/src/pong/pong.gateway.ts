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
  x: 0,
  y: 0,
  width: 12,
  height: 100,
  colour: "#f9e076",
  side: "left",
};
const P2 = {
  x: 1268,
  y: 0,
  width: 12,
  height: 100,
  colour: '#9e2626',
  side: 'right',
};
const listOfPlayers = {};

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected ' + client.id);

  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
    this.server.emit('PlayerDisconnected');
    delete listOfPlayers[client.id];
    console.log('Players :' + (Object.keys(listOfPlayers).length));
  }

  // //JOIN GAME HANDLER
  @SubscribeMessage('join_game')
  public async joinGame(socket_r: Socket, data: any) {
    // const ConnectedSockets = this.server.sockets.adapter.rooms.get(data);
    // const socketRooms = Array.from(socket_r.rooms.values()).filter(
    //   (r) => r !== socket_r.id);

    // await socket_r.join(data);
    // socket_r.to(data).emit('joined_game', data);
    console.log(`joined`);
  }

  //NEW PLAYER HANDLER
  @SubscribeMessage('update')
  handleNewPlayer(client: Socket) {
    listOfPlayers[client.id] = P1;
    this.server.sockets.emit('player1_update', listOfPlayers[client.id]);
    if (Object.keys(listOfPlayers).length === 2) {
      listOfPlayers[client.id] = P2;
      this.server.sockets.emit('player2_update', listOfPlayers[client.id]);
    }
  }

  //handle player movement
  @SubscribeMessage('arrow_keyUP')
  handleArrowKeyUP(client: Socket) {
    if (listOfPlayers[client.id].y > 0) {
      listOfPlayers[client.id].y -= 50;
      console.log(listOfPlayers[client.id].side + listOfPlayers[client.id].y);
      this.server.emit('player1_update', listOfPlayers[client.id]);
    }
  }

  @SubscribeMessage('arrow_keyDown')
  handleArrowKeyDown(client: Socket) {
    if (listOfPlayers[client.id].y < 650) {
      listOfPlayers[client.id].y += 50;
      console.log(listOfPlayers[client.id].side + listOfPlayers[client.id].y);
      this.server.emit('player1_update', listOfPlayers[client.id]);
    }
  }

  //Hadle ball logic
  @SubscribeMessage('ball_init')
  handleBallUpdate(client: Socket, data: any) {
    function collision(objPlayer: any, objBall: any) {
      if (
        objPlayer.x + objPlayer.width > objBall.x &&
        objPlayer.x < objBall.x + objBall.rad &&
        objPlayer.y + objPlayer.height > objBall.y &&
        objPlayer.y < objBall.y + objBall.rad) 
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
      data.dx = -data.dx;
      //update score here
    }
    if (data.x + data.rad > 1268) {
      data.dx = -data.dx;
      //update score here
    }
    // console.log(listOfPlayers[client.id].x);
    if ((collision(listOfPlayers[client.id], data) && data.dx > 0 && 
        listOfPlayers[client.id].side === 'right')){
      data.dx = -data.dx;
      console.log('collision P2');
    }
    if ((collision(listOfPlayers[client.id], data) && data.dx < 0))
    {
      data.dx = -data.dx;
      console.log('collision P1');
    }
    data.x += data.dx;
    data.y += data.dy;
    this.server.emit('ball_update', data);
  }
}
