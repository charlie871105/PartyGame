import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from '../context/SocketContext';
import { ReduxState } from '../redux/store';
import { SingleData } from '../types/game.type';

const useGamepad = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client } = context;
  const { clientId } = useSelector((state: ReduxState) => state.socketReducer);

  const emitGamepadData = useCallback(
    async (data: SingleData[]) => {
      if (!client?.connected) {
        return Promise.reject('client 尚未連線');
      }

      client.emit('player:gamepad-data', {
        playerId: clientId,
        keys: data,
      });
    },
    [client, clientId]
  );
  return { emitGamepadData };
};

export default useGamepad;
