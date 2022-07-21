import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server;
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    this.server.emit('message', 'SENKO CHAT TEST');
  }

  handleConnection() {
    console.log('Client connected');
    this.server.emit('message', 'SENKO CHAT TEST');
  }

  handleDisconnect() {
    console.log('Client disconnected');
  }
}
