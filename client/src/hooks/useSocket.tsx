import { nanoid } from 'nanoid';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { SocketContext } from '../context/SocketContext';
import { SET_CLIENT, SET_CLIENT_ID } from '../redux/reducer/socketReducer';
import { ReduxState } from '../redux/store';
import { ClientType } from '../types/game.type';
import { ClientSocket } from '../types/socket.type';

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client, changeClient } = context;
  const socket = useSelector((state: ReduxState) => state.socketReducer);
  const dispatch = useDispatch();

  function connect(type: `${ClientType}`) {
    if (!socket.clientId) {
      const newId = nanoid();
      localStorage.setItem(`partygame:clientId`, newId);
      dispatch(SET_CLIENT_ID({ id: newId }));
    }

    if (client) {
      client.connect();
      return client;
    }

    const newClient: ClientSocket = io('http://localhost:3000/', {
      transports: ['websocket'],
      query: {
        clientId: socket.clientId,
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
