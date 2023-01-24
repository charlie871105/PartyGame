import { createBrowserRouter } from 'react-router-dom';
import { Home, Console, Lobby } from '../pages';

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
]);

export default router;
