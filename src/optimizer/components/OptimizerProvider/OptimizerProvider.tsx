import React from 'react';
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';

import { environment, isTest } from 'env';

import { useAnalyticsContext } from 'analytics';
import { Loader } from 'shared';

import { OptimizerProviderProps } from './types';

const OptimizerProvider: React.FC<OptimizerProviderProps> = ({ children }) => {
  const { anonymousId } = useAnalyticsContext();

  const apiHost = import.meta.env.VITE_STATSIG_HOST;

  const { client, isLoading } = useClientAsyncInit(
    isTest ? '' : import.meta.env.VITE_STATSIG_KEY,
    {
      customIDs: {
        // Checking for undefined because we don't allow loading segment in development
        stableID: anonymousId ? `${anonymousId}` : undefined,
      },
    },
    {
      environment: {
        tier: environment,
      },
      networkConfig: {
        api: apiHost ? `https://${apiHost}/v1` : undefined,
      },
    },
  );

  if (!isTest && isLoading) {
    return <Loader />;
  }

  return <StatsigProvider client={client}>{children}</StatsigProvider>;
};

export default OptimizerProvider;
