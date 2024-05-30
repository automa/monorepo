import axios from 'axios';

import store from 'store';

import { unsetAuth } from './slices';

export const logout = async () => {
  await axios('/auth/logout');
  store.dispatch(unsetAuth());
};
