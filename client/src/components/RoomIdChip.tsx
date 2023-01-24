import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from '../redux/store';
import '../style/roomIdChip.scss';

interface RoomIdChipProps {
  color?: string;
}

export function RoomIdChip({ color = '#111' }: RoomIdChipProps) {
  const roomId = useSelector(
    (state: ReduxState) => state.gameConsoleReducer.roomId
  );
  return (
    <div className="room-id py-6 px-10 rounded-full" style={{ color }}>
      {roomId}
    </div>
  );
}
