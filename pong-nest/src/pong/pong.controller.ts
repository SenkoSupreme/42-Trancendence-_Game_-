import { Controller, Get } from '@nestjs/common';
import { PongService } from './pong.service';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) {}

  @Get()
  getPong(): string[] {
    return this.pongService.getPong();
  }
}
