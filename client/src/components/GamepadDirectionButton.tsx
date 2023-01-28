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
        keyName="up"
        size={btnsize}
      />
      <GamepadButton
        className="gamepad-btn gamepad-left"
        color="#424242"
        keyName="left"
        size={btnsize}
      />
      <GamepadButton
        className="gamepad-btn gamepad-right"
        color="#424242"
        keyName="right"
        size={btnsize}
      />
      <GamepadButton
        className="gamepad-btn gamepad-down"
        color="#424242"
        keyName="down"
        size={btnsize}
      />
    </div>
  );
}
