import { useCallback, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useLoading from '../hooks/useLoading';
import { ReduxState } from '../redux/store';

export default function Console() {
  const { stopLoading } = useLoading();
  const navigate = useNavigate();
  const roomId = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.roomId
  );
  const redirection = useCallback(() => {
    // 房間 ID 不存在，跳回首頁
    if (!roomId) {
      navigate('/');
      stopLoading();
      return;
    }
    // 跳轉至遊戲大廳
    navigate('lobby');
  }, [navigate, roomId, stopLoading]);

  useLayoutEffect(() => {
    redirection();
  }, [redirection]);
  return null;
}
