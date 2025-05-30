import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from 'auth/types';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
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
    },
    unsetAuth: (state) => {
      state.user = null;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
  },
});

export const { setUserOrg, setAuth, unsetAuth } = authSlice.actions;
export const { selectUser } = authSlice.selectors;

export default authSlice.reducer;
