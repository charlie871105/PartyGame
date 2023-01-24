import { Socket } from 'socket.io';
import { Room } from 'src/room/room.service';

export interface OnEvents {
  'player:join-room': (data: Room) => void;
}

export interface EmitEvents {
  'game-console:room-created': (data: Room) => void;
}

export type ClientSocket = Socket<OnEvents, EmitEvents>;

export interface SocketResponse<T = undefined> {
  status: 'err' | 'suc';
  message: string;
  data?: T;
  error?: any;
}
