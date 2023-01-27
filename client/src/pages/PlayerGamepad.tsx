import { useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import useGamePlayer from '../hooks/useGamePlayer';
import {
  UpdateGameConsoleState,
  UPDATE_GAME_CONSOLE,
} from '../redux/reducer/gameConsoleReducer';
import { ReduxState } from '../redux/store';

function PlayerGamepad() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('Unknow Context');
  }
  const { requestGameConsoleState } = useGamePlayer();
  const { client } = context;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roomId } = useSelector(
    (state: ReduxState) => state.gameConsoleReducer
  );

  const updateEvent = useCallback(
    (state: UpdateGameConsoleState) => {
      console.log(`[ onGameConsoleStateUpdate ] state : `, state);

      dispatch(UPDATE_GAME_CONSOLE(state));

      if (state.status === 'home') {
        navigate('/');
      }
      if (state.status === 'lobby') {
        navigate('lobby');
      }
    },
    [dispatch, navigate]
  );

  useEffect(() => {
    if (!roomId) {
      navigate('/');
    }
    client?.on('game-console:state-update', updateEvent);
    requestGameConsoleState();
    return () => {
      client?.removeListener('game-console:state-update', updateEvent);
    };
  }, [client, navigate, requestGameConsoleState, roomId, updateEvent]);

  return (
    <div className="w-full h-full bg-black">
      <Outlet />
    </div>
  );
}

export default PlayerGamepad;
