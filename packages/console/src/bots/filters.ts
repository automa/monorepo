import { FiltersDefinition, FilterType } from 'shared';

export const publicBotsfilters: FiltersDefinition = {
  ai: {
    type: FilterType.Boolean,
    false: {
      label: 'Deterministic',
      params: {
        is_deterministic: true,
      },
    },
    true: {
      label: 'Uses AI',
      params: {
        is_deterministic: false,
      },
    },
  },
};
