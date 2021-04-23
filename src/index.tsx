import React, { lazy } from 'react';
import ReactDOM from 'react-dom';

import 'reset-css';

import App from 'components/App';
// const App = lazy(() => import('components/App'));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
