import React from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { LoadingOverlay } from './components/LoadingOverlay';
import { store } from './redux/store';
import router from './router';
import './style/app.scss';

function App() {
  return (
    <div id="app">
      <Provider store={store}>
        <LoadingOverlay />
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
