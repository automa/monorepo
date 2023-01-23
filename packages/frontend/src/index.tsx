import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import styled, { ThemeProvider } from 'styled-components/macro';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as Toast from '@radix-ui/react-toast';

import 'reset-css';

import 'index.css';

import 'logger';
import store from 'store';
import theme, { GlobalStyle } from 'theme';
import App from 'views/App';

export const ToastContainer = styled(Toast.Viewport)``;

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Provider store={store}>
        <BrowserRouter>
          <Tooltip.Provider delayDuration={500}>
            <Toast.Provider>
              <App />
              <ToastContainer />
            </Toast.Provider>
          </Tooltip.Provider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
