import { LinearEventHandler, LinearEventType } from './types';

import comment from './comment';
import oauthApp from './oauthApp';

export const eventHandlers: {
  [type in LinearEventType]: LinearEventHandler;
} = {
  [LinearEventType.Comment]: comment,
  [LinearEventType.OAuthApp]: oauthApp,
};

export default eventHandlers;
