import { Avatar } from '@mui/material';
import React, { useMemo } from 'react';
import { getPlayerColor } from '../common/utils';

interface PlayerAvatarProps {
  /** 玩家 ID，同 client ID */
  playerId: string;
  /** 玩家代號 */
  codeName: string;
}
export function PlayerAvatar({ playerId, codeName }: PlayerAvatarProps) {
  const color = useMemo(() => getPlayerColor({ codeName }), [codeName]);
  return (
    <Avatar
      sx={{
        height: '4rem',
        width: '4rem',
        fontSize: '2rem',
        bgcolor: color,
        color: 'white',
      }}
    >
      {codeName}
    </Avatar>
  );
}
