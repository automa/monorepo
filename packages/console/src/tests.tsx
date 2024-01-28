import React, { FC, ReactNode, ReactElement } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/macro';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { FetchMock } from 'vitest-fetch-mock';

import theme from 'theme';
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
    state?: RootState;
    history?: string[];
    path?: string;
  } = {},
) => {
  const AllTheProviders: FC<{ children: ReactNode }> = ({ children }) => {
    return (
      <AnalyticsProvider>
        <ThemeProvider theme={theme}>
          <Provider
            store={configureStore({
              reducer,
              preloadedState: state,
            })}
          >
            <MemoryRouter initialEntries={path && !history ? [path] : history}>
              {children}
            </MemoryRouter>
          </Provider>
        </ThemeProvider>
      </AnalyticsProvider>
    );
  };

  return render(
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
  );
};

const mockedUseNavigate = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockedUseNavigate,
}));

const mockedFetch = fetch as FetchMock;

export * from '@testing-library/react';

export { customRender as render, mockedFetch, mockedUseNavigate };
