import React from 'react';
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';

import { environment, isTest } from 'env';

import { useAnalyticsContext } from 'analytics';
import { Loader } from 'shared';

import { OptimizerProviderProps } from './types';

const OptimizerProvider: React.FC<OptimizerProviderProps> = ({ children }) => {
  const { anonymousId } = useAnalyticsContext();

  // const isOptimizerEnabled = !!import.meta.env.VITE_STATSIG_KEY;

  const { client, isLoading } = useClientAsyncInit(
    import.meta.env.VITE_STATSIG_KEY,
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
    },
  );

  if (!isTest && isLoading) {
    return <Loader />;
  }

  return <StatsigProvider client={client}>{children}</StatsigProvider>;
};

export default OptimizerProvider;
