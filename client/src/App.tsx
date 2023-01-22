import React, { useMemo, useReducer } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { LoadingOverlay } from './components/LoadingOverlay';
import { clientSocketReducer, SocketContext } from './context/SocketContext';
import { store } from './redux/store';
import router from './router';
import './style/app.scss';

function App() {
  const [state, dispatch] = useReducer(clientSocketReducer, {
    client: undefined,
  });
  const socketContext = useMemo(
    () => ({
      client: state.client,
      changeClient: (client: Socket) =>
        dispatch({ type: 'change_client', payload: client }),
    }),
    [state]
  );
  return (
    <div id="app">
      <Provider store={store}>
        <SocketContext.Provider value={socketContext}>
          <LoadingOverlay />
          <RouterProvider router={router} />
        </SocketContext.Provider>
      </Provider>
    </div>
  );
}

export default App;
