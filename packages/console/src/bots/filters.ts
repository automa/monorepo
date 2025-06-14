import { BotType } from 'gql/graphql';
import { FiltersDefinition, FilterType } from 'shared/hooks/useFilters';

export const publicBotsfilters: FiltersDefinition = {
  scheduled: {
    // TODO: Convert to enum filter
    type: FilterType.Boolean,
    false: {
      label: 'Manual',
      params: {
        type: BotType.Manual,
      },
    },
    true: {
      label: 'Scheduled',
      params: {
        type: BotType.Scheduled,
      },
    },
  },
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
