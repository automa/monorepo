import { IntegrationType, ProviderType } from '@automa/common';

import { TaskItemData } from './types';

export const getTaskItemUser = (
  data?: TaskItemData & { userName?: string; userEmail?: string },
) => ({
  name: data?.userName
    ? `${data.userName} from ${data.integration}`
    : undefined,
  email: data?.userEmail,
});

export const originBaseDefinitions: Partial<
  Record<
    IntegrationType,
    {
      link: (data: TaskItemData) => string;
    }
  >
> = {
  [IntegrationType.Linear]: {
    link: (data) =>
      `https://linear.app/${data.organizationUrlKey}/issue/${data.issueIdentifier}#comment-${data.commentId}`,
  },
  [IntegrationType.Jira]: {
    link: (data) =>
      `${data.organizationUrl}/browse/${data.issueKey}?focusedCommentId=${data.commentId}`,
  },
};

export const proposalBaseDefinitions: Partial<
  Record<
    ProviderType,
    {
      link: (data: TaskItemData) => string;
    }
  >
> = {
  [ProviderType.Github]: {
    link: (data) =>
      `https://github.com/${data.repoOrgProviderName}/${data.repoName}/pull/${data.prId}`,
  },
};
