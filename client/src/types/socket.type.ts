import { Socket } from 'socket.io-client';
import { UpdateGameConsoleState } from '../redux/reducer/gameConsoleReducer';

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
  'game-console:state-update': (data: UpdateGameConsoleState) => void;
}

interface OnEvents {
  'game-console:room-created': (data: Room) => void;
  'game-console:state-update': (data: Required<UpdateGameConsoleState>) => void;
}

export type ClientSocket = Socket<OnEvents, EmitEvents>;

export interface SocketResponse<T = undefined> {
  status: 'err' | 'suc';
  message: string;
  data?: T;
  error?: any;
}
