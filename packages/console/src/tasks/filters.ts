import { FiltersDefinition, FilterType } from 'shared/hooks/useFilters';

export const tasksFilters: FiltersDefinition = {
  scheduled: {
    type: FilterType.Boolean,
    false: {
      label: 'Manual',
      params: {
        is_scheduled: false,
      },
    },
    true: {
      label: 'Scheduled',
      params: {
        is_scheduled: true,
      },
    },
  },
};
