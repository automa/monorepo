import { IntegrationType, ProviderType, TaskItemFragment } from 'gql/graphql';

export const getTaskItemUser = (data?: {
  integration?: IntegrationType;
  userName?: string;
  userEmail?: string;
}) => ({
  name: data?.userName
    ? `${data.userName} from ${data.integration}`
    : undefined,
  email: data?.userEmail,
});

export const originBaseDefinitions: Partial<
  Record<
    IntegrationType,
    {
      link: (item: TaskItemFragment) => string;
    }
  >
> = {
  [IntegrationType.Linear]: {
    link: ({ data }) =>
      `https://linear.app/${data.organizationUrlKey}/issue/${data.issueIdentifier}#comment-${data.commentId}`,
  },
  [IntegrationType.Jira]: {
    link: ({ data }) =>
      `${data.organizationUrl}/browse/${data.issueKey}?focusedCommentId=${data.commentId}`,
  },
};

export const proposalBaseDefinitions: Partial<
  Record<
    ProviderType,
    {
      link: (item: TaskItemFragment) => string;
    }
  >
> = {
  [ProviderType.Github]: {
    link: ({ data, repo }) =>
      `https://github.com/${repo!.org.provider_name}/${repo!.name}/pull/${
        data.prNumber
      }`,
  },
};
