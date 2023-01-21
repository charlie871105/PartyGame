import { WebSocketGateway } from '@nestjs/websockets';
import { WsClientService } from './ws-client.service';

@WebSocketGateway()
export class WsClientGateway {
  constructor(private readonly wsClientService: WsClientService) {}
}
