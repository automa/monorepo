import React, { ReactElement } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/macro';
import { render, RenderOptions } from '@testing-library/react';
import mockedFetch from 'jest-fetch-mock';

import theme from 'theme';
import { reducer, RootState } from 'store';

const customRender = (
  ui: ReactElement,
  {
    state,
    history,
    path,
    ...options
  }: RenderOptions & {
    state?: PreloadedState<RootState>;
    history?: string[];
    path?: string;
  } = {},
) => {
  const AllTheProviders: React.FC = ({ children }) => {
    return (
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

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

export * from '@testing-library/react';

export { customRender as render, mockedUseNavigate, mockedFetch };
