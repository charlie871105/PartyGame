import React, { useCallback, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReduxState } from '../redux/store';

function PlayerGamepad() {
  const navigate = useNavigate();
  const { roomId, status } = useSelector(
    (state: ReduxState) => state.gameConsoleReducer
  );

  const redirection = useCallback(() => {
    if (!roomId) {
      navigate('/');
      return;
    }
    if (status === 'lobby') {
      navigate('lobby');
    }
  }, [navigate, roomId, status]);

  useLayoutEffect(() => {
    redirection();
  }, [redirection]);

  return null;
}

export default PlayerGamepad;
