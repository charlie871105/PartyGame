import React from 'react';
import { GamepadButton } from './GamepadButton';
import '../style/gamepadDirectionbutton.scss';

type KeyNames = 'up' | 'left' | 'right' | 'down';

interface GamepadDirectionButtonProps {
  /** 尺寸，直徑 */
  size?: string;
  btnsize?: string;
  className?: string;
}
export function GamepadDirectionButton({
  size = '32rem',
  btnsize = '10rem',
  className,
}: GamepadDirectionButtonProps) {
  return (
    <div
      className={`rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: '#212121' }}
      onTouchMove={(e) => e.preventDefault()}
    >
      <GamepadButton
        className="gamepad-btn gamepad-up"
        color="#424242"
        icon="up"
        size={btnsize}
        onClick={() => console.log('up')}
      />
      <GamepadButton
        className="gamepad-btn gamepad-left"
        color="#424242"
        icon="left"
        size={btnsize}
        onClick={() => console.log('up')}
      />
      <GamepadButton
        className="gamepad-btn gamepad-right"
        color="#424242"
        icon="right"
        size={btnsize}
        onClick={() => console.log('up')}
      />
      <GamepadButton
        className="gamepad-btn gamepad-down"
        color="#424242"
        icon="down"
        size={btnsize}
        onClick={() => console.log('up')}
      />
    </div>
  );
}
