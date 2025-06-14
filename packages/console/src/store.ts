import { useDispatch, useSelector } from 'react-redux';
import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { isProduction } from 'env';

import { appReducer } from 'app/slices';
import { authReducer } from 'auth/slices';
import { orgsReducer } from 'orgs/slices';

export const reducer = combineSlices({
  app: appReducer,
  auth: authReducer,
  orgs: orgsReducer,
});

const store = configureStore({
  reducer,
  devTools: !isProduction,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default store;
