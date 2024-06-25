import { useEffect } from 'react';
import { EventProperties } from '@segment/analytics-next';

import useAnalytics from './useAnalytics';

const useAnalyticsPage = (
  category?: string,
  name?: string,
  properties: EventProperties = {},
) => {
  const { page } = useAnalytics();

  useEffect(() => {
    page(category, name, properties);
  }, [category, name, properties, page]);
};

export default useAnalyticsPage;
