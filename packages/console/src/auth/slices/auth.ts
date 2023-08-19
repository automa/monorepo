import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from 'store';

import { User } from 'auth/types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },
    unsetAuth: (state) => {
      state.user = null;
      state.loading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuth, unsetAuth, setAuthLoading } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;

export const selectAuthLoading = (state: RootState) => state.auth.loading;
