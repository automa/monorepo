import { useContext } from 'react';

import AnalyticsContext from 'analytics/context';

const useAnalyticsContext = () => {
  const { analytics, anonymousId } = useContext(AnalyticsContext);

  if (!analytics) {
    throw new Error(
      '`useAnalytics*` must be used within an `AnalyticsProvider`',
    );
  }

  return { analytics, anonymousId };
};

export default useAnalyticsContext;
