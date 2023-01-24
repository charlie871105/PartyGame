import { WebSocketGateway } from '@nestjs/websockets';
import { UtilsService } from 'src/utils/utils.service';
import { RoomService } from './room.service';
import { WsClientService } from 'src/ws-client/ws-client.service';
import { ClientSocket } from 'src/types/socket.type';

@WebSocketGateway()
export class RoomGateway {
  constructor(
    private readonly roomService: RoomService,
    private readonly utilsService: UtilsService,
    private readonly wsClienService: WsClientService,
  ) {}

  handleConnection(socket: ClientSocket) {
    const queryData = socket.handshake.query as unknown;

    if (!this.utilsService.isSocketQueryData(queryData)) return;

    const { clientId, type } = queryData;

    if (type !== 'game-console') return;

    const room = this.roomService.addRoom(clientId);

    // socket.io api
    socket.join(room.id);

    socket.emit('game-console:room-created', room);
  }
  handleDisconnection(socket: ClientSocket) {
    const client = this.wsClienService.getClient({ socketId: socket.id });

    if (!client) return;

    if (client.type === 'game-console') {
      this.roomService.deleteRoom(client.id);
      return;
    }

    if (client.type === 'player') {
      this.roomService.deletePlayer(client.id);
      return;
    }
  }
}
