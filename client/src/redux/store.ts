import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './reducer/loadingReducer';
import gameReducer from './reducer/gameReducer';

export const store = configureStore({
  reducer: { loadingReducer, gameReducer },
});

export type ReduxState = ReturnType<typeof store.getState>;

export type Dispatch = typeof store.dispatch;
