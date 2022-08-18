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

const players = {};
@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected + ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    delete players[client.id];
    this.server.emit('PlayerDisconnected');
    console.log('number of players:' + Object.keys(players).length);
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
  handleNewPlayer(client: Socket, data: any) {
    players[client.id] = data;
    console.log('number of players:' + Object.keys(players).length);
    if (Object.keys(players).at(1)) {
      players[client.id].side = 'right';
      players[client.id].x = 1268;
      players[client.id].colour = '#9e2626';
      this.server.emit('Second_Player', players[client.id]);
    }
    console.log(players);
    //this.server.sockets.emit('player_update', players[client.id]);
  }

  //handle player movement
  @SubscribeMessage('arrow_keyUP')
  handleArrowKeyUP(client: Socket) {
    if (players[client.id].side === 'left') {
      players[client.id].y -= 50;
      this.server.emit('player1_update', players[client.id]);
    } else if (players[client.id].side === 'right') {
      players[client.id].y -= 50;
      this.server.emit('player2_update', players[client.id]);
    }
  }

  @SubscribeMessage('arrow_keyDown')
  handleArrowKeyDown(client: Socket) {
    if (players[client.id].side === 'left') {
      players[client.id].y += 50;
      this.server.emit('player1_update', players[client.id]);
    } else if (players[client.id].side === 'right') {
      players[client.id].y += 50;
      this.server.emit('player2_update', players[client.id]);
    }
  }
}
