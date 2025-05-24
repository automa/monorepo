import { LinearEventActionHandler } from './types';

import { handleMention } from './comment';

const issueAssignedToYou: LinearEventActionHandler<{
  organizationId: string;
  notification: {
    issue: {
      id: string;
      team: {
        id: string;
        key: string;
        name: string;
      };
    };
    actor: {
      id: string;
      name: string;
      email: string;
    };
  };
}> = async (app, body) => {};

const issueCommentMention: LinearEventActionHandler<{
  organizationId: string;
  notification: {
    issue: {
      id: string;
      team: {
        id: string;
        key: string;
        name: string;
      };
    };
    comment: {
      id: string;
      body: string;
    };
    parentCommentId?: string;
    actor: {
      id: string;
      name: string;
      email: string;
    };
  };
}> = (app, body) =>
  handleMention(app, {
    organizationId: body.organizationId,
    ...body.notification,
  });

// TODO: Handle the following:
// - issueMention
// - issueUnassignedFromYou (not working)
export default {
  issueAssignedToYou,
  issueCommentMention,
};
