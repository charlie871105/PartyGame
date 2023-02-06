import { useCallback, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import useLoading from '../hooks/useLoading';
import {
  Player,
  UPDATE_GAME_CONSOLE,
} from '../redux/reducer/gameConsoleReducer';
import { ReduxState } from '../redux/store';

export default function Console() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { client } = context;
  const { stopLoading } = useLoading();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const roomId = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.roomId
  );

  const updatePlayer = useCallback(
    (players: Player[]) => {
      dispatch(UPDATE_GAME_CONSOLE({ players }));
    },
    [dispatch]
  );

  useEffect(() => {
    // 房間 ID 不存在，跳回首頁
    if (!roomId) {
      navigate('/');
      stopLoading();
      return;
    }
    client?.on('game-console:player-update', updatePlayer);

    // 跳轉至遊戲大廳
    navigate('lobby');

    return () => {
      client?.removeListener('game-console:player-update', updatePlayer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Outlet />;
}
