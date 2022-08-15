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
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): void {
    //this.server.emit('message', 'SENKO CHAT TEST');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected + ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    delete players[client.id];
    this.server.emit('PlayerDisconnected');
    console.log('number of players:' + Object.keys(players).length);
  }
  //JOIN GAME HANDLER
  @SubscribeMessage('join_game')
  public async joinGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any) {

    const ConnectedSockets = this.server.sockets.adapter.rooms.get(data.room);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id);

    await socket.join(data.room);
    socket.to(data.room).emit('joined_game', data);
    console.log(`${data.room} joined`);
  }

  //NEW PLAYER HANDLER
  @SubscribeMessage('update')
  handleNewPlayer(client: Socket, data: any) {
    players[client.id] = data;
    console.log('number of players:' + Object.keys(players).length);
    if (Object.keys(players).length == 2) {
      this.server.emit('renderNewPaddle');
    }
    console.log(players);
    this.server.sockets.emit('player_update', players[client.id]);
  }
}
