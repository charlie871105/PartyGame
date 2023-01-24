import React, { useEffect } from 'react';
import useLoading from '../hooks/useLoading';

function Lobby() {
  const { stopLoading } = useLoading();

  useEffect(() => {
    stopLoading();
  }, [stopLoading]);

  return <div>Lobby</div>;
}

export default Lobby;
