import { nanoid } from 'nanoid';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from '../context/SocketContext';
import { SET_CLIENT, SET_CLIENT_ID } from '../redux/reducer/gameReducer';
import { ReduxState } from '../redux/store';
import { ClientType } from '../types/game';

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client, changeClient } = context;
  const game = useSelector((state: ReduxState) => state.gameReducer);
  const dispatch = useDispatch();

  function connect(type: `${ClientType}`) {
    if (!game.clientId) {
      const newId = nanoid();
      localStorage.setItem(`partygame:clientId`, newId);
      dispatch(SET_CLIENT_ID({ id: newId }));
    }

    if (client) {
      client.connect();
      return client;
    }

    const newClient: Socket = io('http://localhost:3000/', {
      transports: ['websocket'],
      query: {
        clientId: game.clientId,
        type,
      },
    });

    dispatch(SET_CLIENT({ type }));
    changeClient(newClient);
    return newClient;
  }

  function close() {
    client?.close();
  }

  return {
    client,
    connect,
    close,
  };
};

export default useSocket;
