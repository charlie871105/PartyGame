import React from 'react';
import { GameName } from '../redux/reducer/gameConsoleReducer';
import '../style/gameSelectPanel.scss';

export interface GameInfo {
  name: string;
  description: string;
  gameName: `${GameName}`;
  videoSrc: string;
}
export const game: GameInfo = {
  name: '企鵝遊戲',
  description:
    '企鵝群下水前，會將最前頭的企鵝踢下水，確認水中沒有天敵後才會下水，努力不要被踢下水吧！',
  gameName: 'penguin',
  videoSrc: '/games/penguin.mp4',
};

export function GameSelectPanel() {
  return (
    <div className="panel relative rounded-[3rem]">
      <video
        src={game.videoSrc}
        autoPlay
        muted
        loop
        className="absolute w-full h-full"
      />
      <div className="description">
        <div className="name">{game.name}</div>
      </div>
    </div>
  );
}
