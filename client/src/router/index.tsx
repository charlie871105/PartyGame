import { createBrowserRouter } from 'react-router-dom';
import PenguinGame from '../game/penguin/PenguinGame';
import {
  Home,
  Console,
  ConsoleLobby,
  PlayerGamepad,
  GamePadLobby,
} from '../pages';
import PlayerAnalogStick from '../pages/PlayerAnalogStick';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/console',
    element: <Console />,
    children: [
      {
        path: 'lobby',
        element: <ConsoleLobby />,
      },
      {
        path: 'penguin',
        element: <PenguinGame />,
      },
    ],
  },

  {
    path: '/player-gamepad',
    element: <PlayerGamepad />,
    children: [
      {
        path: 'lobby',
        element: <GamePadLobby />,
      },
      {
        path: 'analog-stick',
        element: <PlayerAnalogStick />,
      },
    ],
  },
]);

export default router;
