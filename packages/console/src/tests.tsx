import React, { FC, ReactElement, ReactNode } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import {
  createMemoryRouter,
  NavigateProps,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
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
  uiOrRoute: ReactElement | RouteObject,
  {
    requests,
    cached = {},
    state,
    history,
    uri,
    ...options
  }: RenderOptions & {
    requests?: MockedProviderProps['mocks'];
    cached?: NormalizedCacheObject;
    state?: Partial<RootState>;
    history?: string[];
    uri?: string;
  } = {},
) => {
  cache.restore(cached);

  store.dispatch({ type: 'REPLACE', payload: state });

  const isRoute =
    typeof uiOrRoute === 'object' &&
    ('path' in uiOrRoute || 'Component' in uiOrRoute);

  const entry = uri ?? (isRoute ? uiOrRoute.path : undefined);

  const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <AnalyticsProvider>
        <ApolloProvider mocks={requests} cache={cache}>
          <StoreProvider store={store}>
            <Tooltip.Provider delayDuration={500}>{children}</Tooltip.Provider>
          </StoreProvider>
        </ApolloProvider>
      </AnalyticsProvider>
    );
  };

  return {
    store,
    cache,
    ...render(
      isRoute ? (
        <RouterProvider
          router={createMemoryRouter(
            [
              {
                path: uiOrRoute.children ? undefined : '',
                ...uiOrRoute,
              },
            ],
            {
              initialEntries: entry && !history ? [entry] : history,
            },
          )}
        />
      ) : (
        (uiOrRoute as ReactElement)
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
