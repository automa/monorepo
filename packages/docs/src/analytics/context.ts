import { createContext } from 'react';
import { AnalyticsBrowser, ID } from '@segment/analytics-next';

type IAnalyticsContext = {
  analytics: AnalyticsBrowser | null;
  anonymousId: ID | null;
};

const AnalyticsContext = createContext<IAnalyticsContext>({
  analytics: null,
  anonymousId: null,
});

export default AnalyticsContext;
