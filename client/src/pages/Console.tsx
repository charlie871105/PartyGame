import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useLoading from '../hooks/useLoading';
import { ReduxState } from '../redux/store';

export default function Console() {
  const { stopLoading } = useLoading();
  const navigate = useNavigate();
  const roomId = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.roomId
  );
  const init = useCallback(() => {
    // 房間 ID 不存在，跳回首頁
    if (!roomId) {
      navigate('/');
      stopLoading();
      return;
    }
    // 跳轉至遊戲大廳
    navigate('lobby');
  }, [navigate, roomId, stopLoading]);

  useEffect(() => {
    init();
  }, [init]);
  return <div>Console</div>;
}
