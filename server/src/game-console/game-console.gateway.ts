import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ClientSocket, EmitEvents, OnEvents } from 'src/types/socket.type';
import { UtilsService } from 'src/utils/utils.service';
import { WsClientService } from 'src/ws-client/ws-client.service';
import { GameConsoleService } from './game-console.service';
import { UpdateGameConsoleState } from './game-console.type';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GameConsoleGateway {
  private logger: Logger = new Logger(GameConsoleGateway.name);
  constructor(
    private readonly gameConsoleService: GameConsoleService,
    private readonly utilsService: UtilsService,
    private readonly wsClientService: WsClientService,
  ) {}

  @WebSocketServer()
  private server!: Server<OnEvents, EmitEvents>;

  @SubscribeMessage<keyof OnEvents>('game-console:state-update')
  async handleGameConsoleStateUpdate(
    socket: ClientSocket,
    state: UpdateGameConsoleState,
  ) {
    const client = this.wsClientService.getClient({ socketId: socket.id });

    if (!client) return;

    const { status, gameName } = state;

    this.gameConsoleService.setState(client.id, { status, gameName });

    // 廣播狀態
    this.gameConsoleService.broadcastState(client.id, this.server);
  }
}
