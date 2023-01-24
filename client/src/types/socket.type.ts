import { Socket } from 'socket.io-client';

export interface Room {
  id: string;
  founderId: string;
  playerIds: string[];
}

interface EmitEvents {
  '': () => void;
}

interface OnEvents {
  'game-console:room-created': (data: Room) => void;
}

export type ClientSocket = Socket<OnEvents, EmitEvents>;
