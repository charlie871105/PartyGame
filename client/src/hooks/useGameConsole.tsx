import { useCallback, useContext } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { SocketContext } from '../context/SocketContext';
import {
  GameConsoleStatus,
  GameName,
  UPDATE_GAME_CONSOLE,
} from '../redux/reducer/gameConsoleReducer';
import { ReduxState } from '../redux/store';
import useSocket from './useSocket';

const useGameConsole = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client } = context;
  const { connect, close } = useSocket();
  const dispatch = useDispatch();
  const store = useStore<ReduxState>();

  const setStatus = useCallback(
    (status: `${GameConsoleStatus}`) => {
      dispatch(UPDATE_GAME_CONSOLE({ status }));

      if (!client?.connected) {
        return Promise.reject('client 尚未連線');
      }

      console.log('[ client setStatus ] : ', status);

      client.emit('game-console:state-update', {
        status,
      });
    },
    [client, dispatch]
  );

  const setGameName = useCallback(
    (gameName: `${GameName}`) => {
      dispatch(UPDATE_GAME_CONSOLE({ gameName }));

      if (!client?.connected) {
        return Promise.reject('client 尚未連線');
      }
      console.log('[ client setGameName ] : ', gameName);
      client.emit('game-console:state-update', {
        gameName,
      });
    },
    [client, dispatch]
  );

  const starParty = useCallback(async () => {
    close();

    // 開始連線
    const newClient = connect('game-console');

    return new Promise<string>((resolve, reject) => {
      // 5秒後超時
      const timer = setTimeout(() => {
        close();
        newClient.removeAllListeners();

        reject(Error('連線超時'));
      }, 3000);

      // 連線異常
      newClient.once('connect_error', (error) => {
        newClient.removeAllListeners();
        reject(error);
      });

      // 建立成功
      newClient.once('game-console:room-created', async ({ id }) => {
        newClient.removeAllListeners();
        clearTimeout(timer);
        resolve(id);
      });
    });
  }, [close, connect]);

  const getPlayerCodeName = useCallback(
    (id: string) => {
      const players = store.getState().gameConsoleReducer.players;
      const index = players.findIndex(({ clientId }) => clientId === id);

      if (index < 0) {
        return 'unknown';
      }
      return `${index + 1}P`;
    },
    [store]
  );

  return {
    /** 開始派對
     *
     *建立連線，並回傳房間id
     */
    starParty,
    /** 設定遊戲狀態，會自動同步至房間內所有玩家 */
    setStatus,
    /** 設定遊戲名稱，會自動同步至房間內所有玩家 */
    setGameName,

    getPlayerCodeName,
  };
};

export default useGameConsole;
