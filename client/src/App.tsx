import React, { useMemo, useReducer } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {
  GamepadButton,
  GamepadDirectionButton,
  LoadingOverlay,
} from './components';
import { clientSocketReducer, SocketContext } from './context/SocketContext';
import { store } from './redux/store';
import router from './router';
import './style/app.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ClientSocket } from './types/socket.type';

function App() {
  const [state, dispatch] = useReducer(clientSocketReducer, {
    client: undefined,
  });

  const socketContext = useMemo(
    () => ({
      client: state.client,
      changeClient: (client: ClientSocket) =>
        dispatch({ type: 'change_client', payload: client }),
    }),
    [state]
  );

  return (
    <div id="app">
      <Provider store={store}>
        <SocketContext.Provider value={socketContext}>
          <ToastContainer
            position="bottom-right"
            theme="colored"
            autoClose={1000}
            hideProgressBar
          />
          <LoadingOverlay />
          <RouterProvider router={router} />
        </SocketContext.Provider>
      </Provider>
    </div>
  );
}

export default App;
