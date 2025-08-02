import { LinearEventHandler, LinearEventType } from './types';

import agentSessionEvent from './agentSessionEvent';
import comment from './comment';
import oauthApp from './oauthApp';

export const eventHandlers: {
  [type in LinearEventType]: LinearEventHandler;
} = {
  [LinearEventType.AgentSessionEvent]: agentSessionEvent,
  [LinearEventType.Comment]: comment,
  [LinearEventType.OAuthApp]: oauthApp,
};

export default eventHandlers;
