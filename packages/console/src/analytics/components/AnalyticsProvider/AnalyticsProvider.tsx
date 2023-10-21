import React, { useMemo, useState } from 'react';
import { AnalyticsBrowser, ID } from '@segment/analytics-next';

import { isProduction } from 'env';

import { useAsyncEffect } from 'shared';
import AnalyticsContext from 'analytics/context';

import { AnalyticsProviderProps } from './types';

const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [anonymousId, setAnonymousId] = useState<ID | null>(null);

  const shouldLoad = isProduction;

  const analytics = useMemo(() => {
    const analytics = new AnalyticsBrowser();

    if (shouldLoad) {
      analytics.load({
        writeKey: import.meta.env.VITE_SEGMENT_KEY,
      });
    }

    return analytics;
  }, [shouldLoad]);

  useAsyncEffect(async () => {
    if (shouldLoad) {
      const anonymousId = (await analytics.user()).anonymousId();
      setAnonymousId(anonymousId);
    }

    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        anonymousId,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
