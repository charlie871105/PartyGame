import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { UtilsService } from 'src/utils/utils.service';
import { RoomService, Room } from './room.service';
import { WsClientService } from 'src/ws-client/ws-client.service';
import { ClientSocket, OnEvents, SocketResponse } from 'src/types/socket.type';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class RoomGateway {
  private logger: Logger = new Logger(RoomGateway.name);

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

  @SubscribeMessage<keyof OnEvents>('player:join-room')
  async handlePlayerJoinRoom(socket: ClientSocket, roomId: string) {
    this.logger.log(`socketId : ${socket.id}`);
    this.logger.log(`roomId : ${roomId}`);

    if (!this.roomService.hasRoom(roomId)) {
      const result: SocketResponse = {
        status: 'err',
        message: '指定房間不存在',
      };
      return result;
    }

    const client = this.wsClienService.getClient({ socketId: socket.id });

    if (!client) {
      const result: SocketResponse = {
        status: 'err',
        message: 'Socket Client 不存在，請重新連線',
      };
      return result;
    }

    try {
      const room = await this.roomService.joinRoom(roomId, client.id);
      socket.join(roomId);
      const result: SocketResponse<Room> = {
        status: 'suc',
        message: '加入成功',
        data: room,
      };
      return result;
    } catch (error) {
      const result: SocketResponse = {
        status: 'err',
        message: '加入房間發生異常',
      };
      return result;
    }
  }
}
