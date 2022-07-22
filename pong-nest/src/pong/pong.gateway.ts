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
  server;
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): void {
    //this.server.emit('message', 'SENKO CHAT TEST');
  }
  @SubscribeMessage('update')
  handleUpdate(client: Socket, data: any) {
    console.log(`${data.x} -- ${data.y}`);
    players[client.id] = data;
    console.log('number of players:' + Object.keys(players).length);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected + ${client.id}`);
  }

  handleDisconnect() {
    console.log('Client disconnected');
   //players[].destroy();
  }
}
