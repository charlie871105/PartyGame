import { useContext } from 'react';
import { Room } from '../types/socket.type';
import useSocket from './useSocket';
import { SocketContext } from '../context/SocketContext';

const useGamePlayer = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client } = context;
  const { connect } = useSocket();

  function joinRoom(roomId: string): Promise<Room> {
    return new Promise((resolve, reject) => {
      // client 尚未連線，先進行連線
      if (!client?.connected) {
        const newClient = connect('player');

        newClient.once('connect', () => {
          newClient.removeAllListeners();
          emitJoinRoom(newClient, roomId).then(resolve).catch(reject);
        });

        // 連線異常
        newClient.once('connect_error', (error) => {
          newClient.removeAllListeners();
          reject(error);
        });
        return;
      }
      // client 已連線，發出事件
      emitJoinRoom(client, roomId).then(resolve).catch(reject);
    });
  }

  function emitJoinRoom(
    targetClient: ReturnType<typeof connect>,
    roomId: string
  ): Promise<Room> {
    return new Promise((resolve, reject) => {
      targetClient
        .timeout(3000)
        .emit('player:join-room', roomId, (err, res) => {
          if (err) {
            return reject(err);
          }
          if (res.status === 'err') {
            return reject(res);
          }
          if (!res.data) {
            return reject(res);
          }
          resolve(res.data);
        });
    });
  }

  async function requestGameConsoleState() {
    if (!client?.connected) {
      return Promise.reject('client 尚未連線');
    }
    client.emit('player:request-game-console-state');
  }

  return {
    joinRoom,
    requestGameConsoleState,
  };
};

export default useGamePlayer;
