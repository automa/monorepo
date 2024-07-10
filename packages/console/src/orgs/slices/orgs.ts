import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Org } from 'orgs/types';

interface OrgsState {
  orgs: Org[] | null;
  org: Org | null;
  loading: boolean;
}

const initialState: OrgsState = {
  orgs: null,
  org: null,
  loading: true,
};

export const orgsSlice = createSlice({
  name: 'orgs',
  initialState,
  reducers: {
    setOrg: (state, action: PayloadAction<string>) => {
      const org = state.orgs?.find((o) => o.name === action.payload);

      if (org) {
        state.org = org;
      }
    },
    setOrgBotInstallationsCount: (
      state,
      action: PayloadAction<{ name: string; count: number }>,
    ) => {
      const org = state.orgs?.find((o) => o.name === action.payload.name);

      if (org) {
        org.bot_installations_count = action.payload.count;
      }

      if (state.org?.name === action.payload.name) {
        state.org.bot_installations_count = action.payload.count;
      }
    },
    setOrgs: (state, action: PayloadAction<Org[]>) => {
      state.orgs = action.payload;
      state.loading = false;
    },
    unsetOrgs: (state) => {
      state.orgs = null;
      state.org = null;
      state.loading = false;
    },
    setOrgsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  selectors: {
    selectOrg: (state) => state.org,
    selectOrgs: (state) => state.orgs,
    selectOrgsLoading: (state) => state.loading,
  },
});

export const {
  setOrg,
  setOrgBotInstallationsCount,
  setOrgs,
  unsetOrgs,
  setOrgsLoading,
} = orgsSlice.actions;
export const { selectOrg, selectOrgs, selectOrgsLoading } = orgsSlice.selectors;

export default orgsSlice.reducer;
