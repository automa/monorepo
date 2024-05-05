import React, { FC, ReactNode, ReactElement } from 'react';
import { MemoryRouter, Routes, Route, NavigateProps } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import * as Tooltip from '@radix-ui/react-tooltip';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';

import { reducer, RootState } from 'store';

import { AnalyticsProvider } from 'analytics';

const customRender = (
  ui: ReactElement,
  {
    state,
    history,
    path,
    ...options
  }: RenderOptions & {
    state?: Partial<RootState>;
    history?: string[];
    path?: string;
  } = {},
) => {
  const store = configureStore({
    reducer,
    preloadedState: state,
  });

  const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <AnalyticsProvider>
        <Provider store={store}>
          <MemoryRouter initialEntries={path && !history ? [path] : history}>
            <Tooltip.Provider delayDuration={500}>{children}</Tooltip.Provider>
          </MemoryRouter>
        </Provider>
      </AnalyticsProvider>
    );
  };

  return {
    store,
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
