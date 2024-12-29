import { JiraEventHandler, JiraEventType } from './types';

import commentCreated from './commentCreated';

export const eventHandlers: {
  [type in JiraEventType]: JiraEventHandler;
} = {
  [JiraEventType.CommentCreated]: commentCreated,
  [JiraEventType.CommentUpdated]: commentCreated,
};

export default eventHandlers;
