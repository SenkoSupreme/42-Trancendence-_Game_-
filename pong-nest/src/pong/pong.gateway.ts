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
  width: 8,
  height: 100,
  colour: "#f9e076",
  side: "left",
  points: 0,
};
const P2 = {
  id: 0,
  x: 1272,
  y: 0,
  width: 8,
  height: 100,
  colour: '#9e2626',
  side: 'right',
  points: 0,
};

const listOfPlayers:Map<string, any> = new Map();

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected + ${client.id}`);
    listOfPlayers.set(client.id, P1)
    this.server.sockets.emit('player1_update', listOfPlayers.get(client.id));
    if (listOfPlayers.size == 2) {
      listOfPlayers.set(client.id, P2)
      this.server.sockets.emit('player2_update', listOfPlayers.get(client.id));
    }
    console.log('Players :' + listOfPlayers.size);

  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ' + client.id);
    this.server.emit('PlayerDisconnected');
    listOfPlayers.delete(client.id);
    console.log('Players :' + listOfPlayers.size);
  }

  // //JOIN GAME HANDLER
  // @SubscribeMessage('join_game')
  // public async joinGame(socket_r: Socket, data: any) {
  //   const ConnectedSockets = this.server.sockets.adapter.rooms.get(data);
  //   const socketRooms = Array.from(socket_r.rooms.values()).filter(
  //     (r) => r !== socket_r.id);

  //   await socket_r.join(data);
  //   socket_r.to(data).emit('joined_game', data);
  //   console.log(`${data} joined`);
  // }

  //NEW PLAYER HANDLER
  @SubscribeMessage('update')
  handleNewPlayer(client: Socket) {
    // con
    //console.log('NEXT ' + listOfPlayers.keys().next().value);
    if (listOfPlayers.keys().next().value){
      listOfPlayers.set(listOfPlayers.keys().next().value, P1);
      listOfPlayers.get(listOfPlayers.keys().next().value).id = listOfPlayers.keys().next().value;
      listOfPlayers.get(listOfPlayers.keys().next().value).points = 0;
    }    
    if (listOfPlayers.size == 2) {
      listOfPlayers.set(client.id, P2);
      listOfPlayers.get(client.id).id = client.id;
      listOfPlayers.get(client.id).points = 0;
    }
  }

  //handle player movement
  @SubscribeMessage('arrow_keyUP')
  handleArrowKeyUP(client: Socket) {
    if (listOfPlayers.get(client.id).y > 0) {
      listOfPlayers.get(client.id).y -= 50;
      // console.log(
      //   listOfPlayers.get(client.id).id + ' ' +
      //      listOfPlayers.get(client.id).side + ' ' + 
      //     listOfPlayers.get(client.id).y);
      this.server.emit('player_moved', listOfPlayers.get(client.id));
    }
  }

  @SubscribeMessage('arrow_keyDown')
  handleArrowKeyDown(client: Socket) {
    if (listOfPlayers.get(client.id).y < 650) {
      listOfPlayers.get(client.id).y += 50;
      // console.log(
      //   listOfPlayers.get(client.id).id + ' ' + 
      //  listOfPlayers.get(client.id).side + ' ' + 
      // listOfPlayers.get(client.id).y);
      this.server.emit('player_moved', listOfPlayers.get(client.id));
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
      listOfPlayers.get(client.id).points++;
      this.server.emit('player2_scored', listOfPlayers.get(client.id));
      
    }
    if (data.x + data.rad > 1280) {
      data.dx = -data.dx;
      //update score here
      listOfPlayers.get(listOfPlayers.keys().next().value).points++;
      this.server.emit('player1_scored', listOfPlayers.get(listOfPlayers.keys().next().value));
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
    //console.log('ball ' + data.x + ' ' + data.y);
    this.server.sockets.emit('ball_update', data);
  }
}
