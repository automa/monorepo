import axios from 'axios';

import store from 'store';

import { unsetOrgs } from 'orgs/slices';

import { unsetAuth } from './slices';

export const logout = async () => {
  await axios('/auth/logout');
  store.dispatch(unsetAuth());
  store.dispatch(unsetOrgs());
};
