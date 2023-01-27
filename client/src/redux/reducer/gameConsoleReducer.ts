import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum GameConsoleStatus {
  /** 首頁 */
  HOME = 'home',
  /** 大廳等待中 */
  LOBBY = 'lobby',
  /** 遊戲中 */
  PLAYING = 'playing',
}

export enum GameName {}

export interface Player {
  clientId: string;
}

/** 更新遊戲機狀態
 *
 * roomId 不可變更，以外參數允許持續更新
 */
export type UpdateGameConsoleState = Partial<Omit<GameConsoleState, 'roomId'>>;

export interface GameConsoleState {
  status: `${GameConsoleStatus}`;
  gameName?: `${GameName}`;
  roomId?: string;
  players: Player[];
}

const initialState: GameConsoleState = {
  status: 'home',
  gameName: undefined,
  /** 房間 ID，6 位數字 */
  roomId: undefined,
  players: [],
};

export const gameConsoleSlice = createSlice({
  name: 'gameConsole',
  initialState,
  reducers: {
    UPDATE_GAME_CONSOLE: (
      state,
      action: PayloadAction<UpdateGameConsoleState>
    ) => {
      state = { ...state, ...action.payload };
      return state;
    },
    SET_ROOM_ID: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
  },
});

export const { UPDATE_GAME_CONSOLE, SET_ROOM_ID } = gameConsoleSlice.actions;
export default gameConsoleSlice.reducer;
