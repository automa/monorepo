import { init, captureException, withScope } from '@sentry/browser';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { environment, product, service, version } from 'env';

import { ErrorCard } from 'shared';

const isSentryEnabled = !!import.meta.env.VITE_SENTRY_DSN;
const tunnelHost = import.meta.env.VITE_SENTRY_HOST;

if (isSentryEnabled) {
  init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: `${product}-${service}@${version}`,
    environment,
    tunnel: tunnelHost ? `https://${tunnelHost}` : undefined,
  });
}

export const errorCapture = (error: Error) => {
  if (isSentryEnabled) {
    withScope((scope) => {
      scope.setExtra('error', { message: error.message });
      captureException(error);
    });
  } else {
    console.error(error);
  }
};

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary fallbackRender={ErrorCard}>
      {children}
    </ReactErrorBoundary>
  );
};
