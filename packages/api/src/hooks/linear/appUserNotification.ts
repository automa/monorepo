import { getMentionUsername } from '../utils';

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
}> = async (app, body) =>
  handleMention(app, {
    organizationId: body.organizationId,
    comment: {
      id: undefined,
      body: getMentionUsername(),
    },
    parentCommentId: undefined,
    ...body.notification,
  });

// We are not handling the `appUserNotification.issueCommentMention` event as it
// is handled by the `comment.create` event (so that unmentioned comments work too).
// If you want to reinstate, revert the commit that added this comment.

// TODO: Handle the following:
// - issueMention
// - issueUnassignedFromYou (not working)
export default {
  issueAssignedToYou,
};
