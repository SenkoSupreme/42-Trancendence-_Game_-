import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PongModule } from './pong/pong.module';
import { PongGateway } from './pong/pong.gateway';

@Module({
  imports: [PongModule],
  controllers: [AppController],
  providers: [AppService, PongGateway],
})
export class AppModule {}
