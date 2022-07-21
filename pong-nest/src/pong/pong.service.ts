import { Injectable } from '@nestjs/common';

@Injectable()
export class PongService {
    getPong(): string[] {
        return ['player1', 'player2'];
    }
}
