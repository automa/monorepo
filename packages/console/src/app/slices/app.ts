import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { App } from 'gql/graphql';

interface AppState {
  app: App | null;
}

const initialState: AppState = {
  app: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setApp: (state, action: PayloadAction<App>) => {
      state.app = action.payload;
    },
    unsetApp: (state) => {
      state.app = null;
    },
  },
  selectors: {
    selectApp: (state) => state.app,
  },
});

export const { setApp, unsetApp } = appSlice.actions;
export const { selectApp } = appSlice.selectors;

export default appSlice.reducer;
