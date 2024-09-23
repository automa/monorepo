import { IntegrationType, ProviderType, TaskItemType } from '@automa/common';

export type TaskItemData = {
  [key: string]: any;
};

export type TaskItemTypeWithData =
  | {
      type: TaskItemType.Origin;
      data: TaskItemData & { integration: IntegrationType };
    }
  | {
      type: TaskItemType.Proposal | TaskItemType.Repo;
      data: TaskItemData & { repoOrgProviderType: ProviderType };
    }
  | {
      type: TaskItemType.Bot | TaskItemType.Message;
      data: TaskItemData;
    };
