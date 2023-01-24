import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import { ClientType } from '../../types/game.type';

export interface SocketState {
  /** 儲存於 LocalStorage 中，識別是否為同一個連線 */
  clientId: string;

  type?: `${ClientType}`;
}

type SetClientIdParams = {
  id: string;
};
type SetClientParams = {
  type: `${ClientType}`;
};

const initialState: SocketState = {
  clientId: localStorage.getItem(`partygame:clientId`) ?? nanoid(),
  type: undefined,
};

export const socketSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    SET_CLIENT_ID: (state, action: PayloadAction<SetClientIdParams>) => {
      const { id } = action.payload;
      state.clientId = id;
    },
    SET_CLIENT: (state, action: PayloadAction<SetClientParams>) => {
      const { type } = action.payload;
      state.type = type;
    },
  },
});

export const { SET_CLIENT, SET_CLIENT_ID } = socketSlice.actions;
export default socketSlice.reducer;
