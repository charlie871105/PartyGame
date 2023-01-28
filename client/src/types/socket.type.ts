import { Socket } from 'socket.io-client';
import {
  Player,
  UpdateGameConsoleState,
} from '../redux/reducer/gameConsoleReducer';
import { GamepadData } from './game.type';

export interface Room {
  id: string;
  founderId: string;
  playerIds: string[];
}

interface EmitEvents {
  'player:join-room': (
    roomId: string,
    callback?: (err: any, res: SocketResponse<Room>) => void
  ) => void;
  'player:request-game-console-state': () => void;
  'player:gamepad-data': (data: GamepadData) => void;
  'game-console:state-update': (data: UpdateGameConsoleState) => void;
}

interface OnEvents {
  'game-console:room-created': (data: Room) => void;
  'game-console:state-update': (data: Required<UpdateGameConsoleState>) => void;
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
