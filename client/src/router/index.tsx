import { createBrowserRouter } from 'react-router-dom';
import { Home, Console, Lobby, PlayerGamepad, GamePadLobby } from '../pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/console',
    element: <Console />,
  },
  {
    path: '/console/lobby',
    element: <Lobby />,
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
