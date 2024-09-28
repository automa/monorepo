import { BotType } from 'gql/graphql';
import { FiltersDefinition, FilterType } from 'shared';

export const publicBotsfilters: FiltersDefinition = {
  type: {
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
