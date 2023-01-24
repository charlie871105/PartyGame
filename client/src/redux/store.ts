import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './reducer/loadingReducer';
import socketReducer from './reducer/socketReducer';
import gameConsoleReducer from './reducer/gameConsoleReducer';

export const store = configureStore({
  reducer: { loadingReducer, socketReducer, gameConsoleReducer },
});

export type ReduxState = ReturnType<typeof store.getState>;

export type Dispatch = typeof store.dispatch;
