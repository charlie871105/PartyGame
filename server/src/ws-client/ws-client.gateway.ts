import { WebSocketGateway } from '@nestjs/websockets';
import { WsClientService } from './ws-client.service';
import { Socket } from 'socket.io';
import { UtilsService } from '../utils/utils.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class WsClientGateway {
  private logger: Logger = new Logger(WebSocketGateway.name);
  constructor(
    private readonly wsClientService: WsClientService,
    private readonly utilsService: UtilsService,
  ) {}

  handleConnection(socket: Socket) {
    const queryData = socket.handshake.query as unknown;
    this.logger.log(`client connected : ${socket.id}`);

    // 資料錯誤，中斷連線
    if (!this.utilsService.isSocketQueryData(queryData)) {
      socket.disconnect();
      return;
    }

    const { clientId, type } = queryData;
    this.logger.log(`queryData : `, queryData);

    this.wsClientService.putClient({
      socketId: socket.id,
      clientId,
      type,
    });
  }
}
