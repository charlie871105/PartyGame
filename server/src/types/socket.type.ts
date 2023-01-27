import { Socket } from 'socket.io';
import {
  GameConsoleState,
  UpdateGameConsoleState,
} from 'src/game-console/game-console.type';
import { Room } from 'src/room/room.service';

export interface OnEvents {
  'player:join-room': (data: Room) => void;
  'game-console:state-update': (data: UpdateGameConsoleState) => void;
  'player:request-game-console-state': () => void;
}

export interface EmitEvents {
  'game-console:room-created': (data: Room) => void;
  'game-console:state-update': (data: GameConsoleState) => void;
}

export type ClientSocket = Socket<OnEvents, EmitEvents>;

export interface SocketResponse<T = undefined> {
  status: 'err' | 'suc';
  message: string;
  data?: T;
  error?: any;
}
