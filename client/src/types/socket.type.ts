import { Socket } from 'socket.io-client';

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
}

interface OnEvents {
  'game-console:room-created': (data: Room) => void;
}

export type ClientSocket = Socket<OnEvents, EmitEvents>;

export interface SocketResponse<T = undefined> {
  status: 'err' | 'suc';
  message: string;
  data?: T;
  error?: any;
}
