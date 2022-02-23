import React, { ReactElement } from 'react';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { render, RenderOptions } from '@testing-library/react';

import theme from 'theme';
import { reducer, RootState } from 'store';

const customRender = (
  ui: ReactElement,
  {
    preloadedState,
    ...options
  }: RenderOptions & {
    preloadedState?: PreloadedState<RootState>;
  } = {},
) => {
  const AllTheProviders: React.FC = ({ children }) => {
    return (
      <ThemeProvider theme={theme}>
        <Provider
          store={configureStore({
            reducer,
            preloadedState,
          })}
        >
          {children}
        </Provider>
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from '@testing-library/react';

export { customRender as render };
