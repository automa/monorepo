import { ReactNode } from 'react';

import { IntegrationType } from '@automa/common';

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
      title: (data: TaskItemData) => ReactNode;
      link: (data: TaskItemData) => string;
    }
  >
> = {
  [IntegrationType.Linear]: {
    title: (data) => data.issueIdentifier,
    link: (data) =>
      `https://linear.app/${data.organizationUrlKey}/issue/${data.issueIdentifier}#comment-${data.commentId}`,
  },
  [IntegrationType.Jira]: {
    title: (data) => data.issueKey,
    link: (data) =>
      `${data.organizationUrl}/browse/${data.issueKey}?focusedCommentId=${data.commentId}`,
  },
};
