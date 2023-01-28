import { createBrowserRouter } from 'react-router-dom';
import {
  Home,
  Console,
  ConsoleLobby,
  PlayerGamepad,
  GamePadLobby,
} from '../pages';

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
    ],
  },
]);

export default router;
