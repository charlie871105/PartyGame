import { Room } from '../types/socket.type';
import useSocket from './useSocket';

const useGamePlayer = () => {
  const { client, connect } = useSocket();

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

  return {
    joinRoom,
  };
};

export default useGamePlayer;
