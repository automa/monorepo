import { useCallback, useContext } from 'react';
import { EventProperties } from '@segment/analytics-next';

import { environment } from 'env';

import { User, useUser } from 'auth';

import AnalyticsContext from 'analytics/context';

const useAnalytics = () => {
  const user = useUser();

  const { analytics, anonymousId } = useContext(AnalyticsContext);

  if (!analytics) {
    throw new Error(
      '`useAnalytics` must be used within an `AnalyticsProvider`',
    );
  }

  const identify = useCallback(
    (user: User | null) => {
      if (!user) {
        return;
      }

      analytics.identify(user.id, {
        email: user.email,
      });

      analytics.group(
        user.org_id,
        {},
        {
          integrations: {
            Statsig: false,
          },
        },
      );
    },
    [analytics],
  );

  const track = useCallback(
    (eventName: string, properties: EventProperties = {}) => {
      analytics.track(eventName, {
        ...properties,
        statsigEnvironment: {
          tier: environment,
        },
        statsigCustomIDs: [...(user?.org_id ? ['orgID', user.org_id] : [])],
      });
    },
    [analytics, user],
  );

  return { anonymousId, identify, track };
};

export default useAnalytics;
