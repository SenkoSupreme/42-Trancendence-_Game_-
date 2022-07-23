import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

const players = {};
@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: any;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): void {
    //this.server.emit('message', 'SENKO CHAT TEST');
  }
  @SubscribeMessage('update')
  handleUpdate(client: Socket, data: any) {
    console.log(`${data.x} -- ${data.y}`);
    players[client.id] = data;
    console.log('number of players:' + Object.keys(players).length);
    console.log(players);
    if (Object.keys(players).length == 2) {
      players[client.id].x = 1260;
      this.server.emit('Newpaddle', players[client.id]);
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected + ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    delete players[client.id];
    console.log('number of players:' + Object.keys(players).length);
  }
}
