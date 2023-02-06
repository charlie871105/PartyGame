import { Injectable, Logger } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { WsClientService } from 'src/ws-client/ws-client.service';
import { GameConsoleState, Player } from './game-console.type';
import { cloneDeep, defaults, merge } from 'lodash';
import { EmitEvents, OnEvents } from 'src/types/socket.type';
import { Server } from 'socket.io';

/**
 * GameConsoleService 不需要儲存players的資訊
 * 相關資訊由RoomService提供
 */
type GameConsoleData = Omit<GameConsoleState, 'players'>;

const defauState: GameConsoleData = {
  status: 'home',
  gameName: undefined,
};

@Injectable()
export class GameConsoleService {
  private logger: Logger = new Logger(GameConsoleService.name);
  /** key 為開房者的clientId */
  private readonly gameConsolesMap = new Map<string, GameConsoleData>();

  constructor(
    private readonly roomService: RoomService,
    private readonly wsClientService: WsClientService,
  ) {}

  setState(founderId: string, state: Partial<GameConsoleData>) {
    const originState = this.gameConsolesMap.get(founderId);

    let newState: GameConsoleData;
    if (originState) {
      newState = merge(originState, state);
    } else {
      newState = defaults(state, defauState);
    }

    this.gameConsolesMap.set(founderId, newState);
  }

  getState(founderId: string) {
    const data = this.gameConsolesMap.get(founderId);

    // 取得房間
    const room = this.roomService.getRoom({ founderId });

    if (!room) {
      return undefined;
    }

    // 加入玩家
    const players: Player[] = room.playerIds.map((playerId) => ({
      clientId: playerId,
    }));

    const state: GameConsoleState = {
      ...data,
      status: data?.status ?? 'home',
      players,
    };
    return state;
  }

  async broadcastState(
    founderId: string,
    server: Server<OnEvents, EmitEvents>,
  ) {
    const room = this.roomService.getRoom({ founderId });

    if (!room) {
      this.logger.warn(`此 founderId 為建立任何房間 : ${founderId}`);
      return;
    }

    const state = this.getState(founderId);

    if (!state) {
      this.logger.warn(`此 founderId 不存在state : ${founderId}`);
      return;
    }

    const sockets = await server.in(room.id).fetchSockets();

    this.logger.log(`broacast state : `, state);
    sockets.forEach((socketItem) => [
      socketItem.emit('game-console:state-update', state),
    ]);
  }
}
