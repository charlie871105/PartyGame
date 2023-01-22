import React, { createContext } from 'react';
import { Socket } from 'socket.io-client';

export interface SocketContextType {
  /** Socket.io Client 物件 */
  client?: Socket;
  changeClient: (client: Socket) => void;
}
export type ClientSocketState = {
  client?: Socket;
};
export type ClientSocketChangeEvent = {
  type: 'change_client';
  payload?: Socket;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const clientSocketReducer = (
  state: ClientSocketState,
  action: ClientSocketChangeEvent
) => {
  switch (action.type) {
    case 'change_client':
      return {
        ...state,
        client: action.payload,
      };
    default:
      throw new Error('Unknow socket client event');
  }
};
