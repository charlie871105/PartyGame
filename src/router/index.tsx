import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Home, Console } from '../pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/console',
    element: <Console />,
  },
]);

export default router;
