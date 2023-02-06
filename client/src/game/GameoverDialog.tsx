import { Dialog } from '@mui/material';
import React from 'react';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import '../style/gameoverDailog.scss';
import { useEngine } from 'react-babylonjs';

interface GameoverDialogProps {
  isGameOver: boolean;
  winnerCodeName: string;
}
function GameoverDialog({ isGameOver, winnerCodeName }: GameoverDialogProps) {
  return (
    <Dialog open={isGameOver}>
      <div className="gameover-panel gap-14">
        <div className="flex items-center text-3xl text-gray-600">
          <EmojiEventsIcon />
          遊戲結束
        </div>
        <div className="text-3xl text-sky-700">
          玩家 {winnerCodeName} 獲勝！
        </div>

        <div className="text-xl text-gray-400">再次按下攻擊鍵回到大廳</div>
      </div>
    </Dialog>
  );
}

export default GameoverDialog;
