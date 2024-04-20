import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { isProduction } from 'env';

import { authReducer } from 'auth';
import { orgsReducer } from 'orgs';

export const reducer = combineSlices({
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
