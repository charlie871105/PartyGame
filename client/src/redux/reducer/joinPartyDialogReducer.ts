import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Id } from 'react-toastify';

export interface JoinPartyDialogState {
  open: boolean;
  toastId?: Id;
}

const initialState: JoinPartyDialogState = {
  open: false,
  toastId: undefined,
};

export const joinPartyDialoSlice = createSlice({
  name: 'joinPartyDialog',
  initialState,
  reducers: {
    OPEN_DIALOG: (state) => {
      state.open = true;
    },
    CLOSE_DIALOG: (state) => {
      state.open = true;
    },
    SET_TOAST_ID: (state, action: PayloadAction<Id>) => {
      state.toastId = action.payload;
    },
  },
});

export const { OPEN_DIALOG, CLOSE_DIALOG, SET_TOAST_ID } =
  joinPartyDialoSlice.actions;
export default joinPartyDialoSlice.reducer;
