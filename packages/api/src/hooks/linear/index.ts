import { LinearEventHandler, LinearEventType } from './types';

import agentSessionEvent from './agentSessionEvent';
import comment from './comment';
import oauthAuthorization from './oauthAuthorization';

export const eventHandlers: {
  [type in LinearEventType]: LinearEventHandler;
} = {
  [LinearEventType.AgentSessionEvent]: agentSessionEvent,
  [LinearEventType.Comment]: comment,
  [LinearEventType.OAuthAuthorization]: oauthAuthorization,
};

export default eventHandlers;
