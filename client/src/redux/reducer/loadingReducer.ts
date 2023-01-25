import { createSlice } from '@reduxjs/toolkit';

export interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    START_LOADING: (state) => {
      state.isLoading = true;
    },
    STOP_LOADING: (state) => {
      state.isLoading = false;
    },
  },
});

export const { START_LOADING, STOP_LOADING } = loadingSlice.actions;
export default loadingSlice.reducer;
