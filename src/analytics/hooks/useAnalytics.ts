import { useCallback } from 'react';
import { EventProperties } from '@segment/analytics-next';

import { environment } from 'env';

import { User, useUser } from 'auth';

import useAnalyticsContext from './useAnalyticsContext';

const useAnalytics = () => {
  const user = useUser();

  const { analytics, anonymousId } = useAnalyticsContext();

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

  const page = useCallback(
    (category?: string, name?: string, properties: EventProperties = {}) => {
      analytics.page(category, name, {
        ...properties,
        statsigEnvironment: {
          tier: environment,
        },
        statsigCustomIDs: [...(user?.org_id ? ['orgID', user.org_id] : [])],
      });
    },
    [analytics, user],
  );

  return { anonymousId, identify, track, page };
};

export default useAnalytics;
