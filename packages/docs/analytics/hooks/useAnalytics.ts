import { useCallback, useContext } from 'react';
import { EventProperties } from '@segment/analytics-next';

import { environment } from 'env';

import AnalyticsContext from 'analytics/context';

const useAnalytics = () => {
  const { analytics, anonymousId } = useContext(AnalyticsContext);

  if (!analytics) {
    throw new Error(
      '`useAnalytics` must be used within an `AnalyticsProvider`',
    );
  }

  const track = useCallback(
    (eventName: string, properties: EventProperties = {}) => {
      analytics.track(eventName, {
        ...properties,
        statsigEnvironment: {
          tier: environment,
        },
      });
    },
    [analytics],
  );

  return { anonymousId, track };
};

export default useAnalytics;
