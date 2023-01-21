import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './reducer/loadingReducer';

export const store = configureStore({
  reducer: { loadingReducer },
});

export type ReduxState = ReturnType<typeof store.getState>;

export type Dispatch = typeof store.dispatch;
