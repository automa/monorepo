import React, { FC, ReactElement, ReactNode } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { MemoryRouter, NavigateProps, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { NormalizedCacheObject } from '@apollo/client';
import {
  MockedProvider as ApolloProvider,
  MockedProviderProps,
} from '@apollo/client/testing';
import { render, RenderOptions } from '@testing-library/react';
import * as Tooltip from '@radix-ui/react-tooltip';
import axios from 'axios';

import { cache } from 'client';
import store, { reducer, RootState } from 'store';

import { AnalyticsProvider } from 'analytics';

store.replaceReducer((state, { type, payload }) => {
  if (type === 'REPLACE') {
    return { ...state, ...(payload as RootState) };
  }

  return reducer(state, { type, payload });
});

const customRender = (
  ui: ReactElement,
  {
    requests,
    cached = {},
    state,
    history,
    path,
    ...options
  }: RenderOptions & {
    requests?: MockedProviderProps['mocks'];
    cached?: NormalizedCacheObject;
    state?: Partial<RootState>;
    history?: string[];
    path?: string;
  } = {},
) => {
  cache.restore(cached);

  store.dispatch({ type: 'REPLACE', payload: state });

  const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <AnalyticsProvider>
        <ApolloProvider mocks={requests} cache={cache}>
          <StoreProvider store={store}>
            <MemoryRouter initialEntries={path && !history ? [path] : history}>
              <Tooltip.Provider delayDuration={500}>
                {children}
              </Tooltip.Provider>
            </MemoryRouter>
          </StoreProvider>
        </ApolloProvider>
      </AnalyticsProvider>
    );
  };

  return {
    store,
    cache,
    ...render(
      path ? (
        <Routes>
          <Route path={path} element={ui} />
        </Routes>
      ) : (
        ui
      ),
      {
        wrapper: AllTheProviders,
        ...options,
      },
    ),
  };
};

vi.mock('axios');

const mockedAxios = vi.mocked(axios);

const mockedUseNavigate = vi.fn();
const mockedNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockedUseNavigate,
  Navigate: (props: NavigateProps) => {
    mockedNavigate(props);
    return null;
  },
}));

export * from '@testing-library/react';

export {
  customRender as render,
  mockedAxios,
  mockedUseNavigate,
  mockedNavigate,
};
