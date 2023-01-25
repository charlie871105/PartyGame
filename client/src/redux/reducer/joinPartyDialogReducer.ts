import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Id } from 'react-toastify';

export interface JoinPartyDialogState {
  open: boolean;
}

const initialState: JoinPartyDialogState = {
  open: false,
};

export const joinPartyDialoSlice = createSlice({
  name: 'joinPartyDialog',
  initialState,
  reducers: {
    OPEN_DIALOG: (state) => {
      state.open = true;
    },
    CLOSE_DIALOG: (state) => {
      state.open = false;
    },
  },
});

export const { OPEN_DIALOG, CLOSE_DIALOG } = joinPartyDialoSlice.actions;
export default joinPartyDialoSlice.reducer;
