import React, { FC, ReactNode, ReactElement } from 'react';
import { MemoryRouter, Routes, Route, NavigateProps } from 'react-router-dom';
import { Provider as StoreProvider } from 'react-redux';
import { NormalizedCacheObject } from '@apollo/client';
import {
  MockedProvider as ApolloProvider,
  MockedProviderProps,
} from '@apollo/client/testing';
import * as Tooltip from '@radix-ui/react-tooltip';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';

import store, { reducer, RootState } from 'store';
import { cache } from 'client';

import { AnalyticsProvider } from 'analytics';

const customRender = (
  ui: ReactElement,
  {
    cached = {},
    state,
    requests,
    history,
    path,
    ...options
  }: RenderOptions & {
    cached?: NormalizedCacheObject;
    state?: Partial<RootState>;
    requests?: MockedProviderProps['mocks'];
    history?: string[];
    path?: string;
  } = {},
) => {
  cache.restore(cached);

  store.replaceReducer((_, { payload }) => payload as RootState);
  store.dispatch({ type: 'REPLACE', payload: state });
  store.replaceReducer(reducer);

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
