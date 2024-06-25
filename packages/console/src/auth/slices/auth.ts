import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    setUserOrg: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.org_id = action.payload;
      }
    },
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
  selectors: {
    selectUser: (state) => state.user,
    selectAuthLoading: (state) => state.loading,
  },
});

export const { setUserOrg, setAuth, unsetAuth, setAuthLoading } =
  authSlice.actions;
export const { selectUser, selectAuthLoading } = authSlice.selectors;

export default authSlice.reducer;
