import React, { createContext } from 'react';
import { ClientSocket } from '../types/socket.type';

export interface SocketContextType {
  /** Socket.io Client 物件 */
  client?: ClientSocket;
  changeClient: (client: ClientSocket) => void;
}
export type ClientSocketState = {
  client?: ClientSocket;
};
export type ClientSocketChangeEvent = {
  type: 'change_client';
  payload?: ClientSocket;
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
