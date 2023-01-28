import { Socket } from 'socket.io';
import {
  GameConsoleState,
  Player,
  UpdateGameConsoleState,
} from 'src/game-console/game-console.type';
import { Room } from 'src/room/room.service';
import { GamepadData } from './player.type';

export interface OnEvents {
  'game-console:state-update': (data: UpdateGameConsoleState) => void;
  'player:join-room': (data: Room) => void;
  'player:request-game-console-state': () => void;
  'player:gamepad-data': (data: GamepadData) => void;
}

export interface EmitEvents {
  'game-console:room-created': (data: Room) => void;
  'game-console:state-update': (data: GameConsoleState) => void;
  'game-console:player-update': (data: Player[]) => void;
  'player:gamepad-data': (data: GamepadData) => void;
}

export type ClientSocket = Socket<OnEvents, EmitEvents>;

export interface SocketResponse<T = undefined> {
  status: 'err' | 'suc';
  message: string;
  data?: T;
  error?: any;
}
