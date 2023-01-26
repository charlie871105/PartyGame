import React, { useEffect } from 'react';
import useGameConsole from '../hooks/useGameConsole';
import useLoading from '../hooks/useLoading';

export default function GamePadLobby() {
  const { stopLoading } = useLoading();
  const { setStatus } = useGameConsole();

  useEffect(() => {
    setStatus('lobby');
    stopLoading();
  }, [setStatus, stopLoading]);
  return (
    <div className="w-full h-full flex text-white select-none bg-black">
      GamePadLobby
    </div>
  );
}
