import { Button, createTheme, styled, ThemeProvider } from '@mui/material';
import React, {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  TouchEvent,
  useMemo,
  useRef,
} from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRighttIcon from '@mui/icons-material/ArrowRight';

type GameButtonIconType = 'done' | 'up' | 'down' | 'left' | 'right';

interface GameButtonProps {
  btnsize?: string;
  /** 按鈕內 icon 名稱 */
}
const GameButton = styled(Button)(({ btnsize }: GameButtonProps) => ({
  width: btnsize,
  height: btnsize,
  padding: '1rem',
  borderRadius: '100%',
  minWidth: '0px',
  minHeight: '0px',
}));

interface GamepadButtonProps {
  className?: string;
  /** 尺寸 */
  size?: string;
  /** 按鈕內 icon 名稱 */
  icon: GameButtonIconType;

  /** 按鈕底色 */
  color?: string;
  /** 按鈕觸發底色 */
  activeColor?: string;
  hoverColor?: string;
  onClick: () => void;
}

const GameButtonIcon: { [key in GameButtonIconType]: ReactNode } = {
  done: <DoneIcon sx={{ width: '80%', height: '80%' }} />,
  up: <ArrowDropUpIcon sx={{ width: '80%', height: '80%' }} />,
  down: <ArrowDropDownIcon sx={{ width: '80%', height: '80%' }} />,
  right: <ArrowRighttIcon sx={{ width: '80%', height: '80%' }} />,
  left: <ArrowLeftIcon sx={{ width: '80%', height: '80%' }} />,
};

export function GamepadButton({
  className,
  size = '2rem',
  color = '#212121',
  hoverColor = '#757575',
  activeColor = '#eeeeee',
  icon = 'done',
  onClick,
}: GamepadButtonProps) {
  const status = useRef(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            light: activeColor,
            main: color,
            dark: hoverColor,
          },
        },
      }),
    [activeColor, color, hoverColor]
  );

  const onMouseUp = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();

    status.current = false;

    onClick();
  };

  const onMouseDown = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();

    status.current = true;
  };

  const onTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();

    status.current = false;

    onClick();
  };

  const onTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    event.preventDefault();

    status.current = true;
  };

  return (
    <div className={className}>
      <ThemeProvider theme={theme}>
        <GameButton
          variant="contained"
          btnsize={size}
          color="primary"
          onClick={onClick}
          onMouseUp={(event) => onMouseUp(event)}
          onMouseDown={(event) => onMouseDown(event)}
          onTouchStart={(event) => onTouchStart(event)}
          onTouchEnd={(event) => onTouchEnd(event)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {GameButtonIcon[icon]}
        </GameButton>
      </ThemeProvider>
    </div>
  );
}
