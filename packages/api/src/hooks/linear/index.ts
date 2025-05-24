import { LinearEventHandler, LinearEventType } from './types';

import appUserNotification from './appUserNotification';
import comment from './comment';
import oauthApp from './oauthApp';

export const eventHandlers: {
  [type in LinearEventType]: LinearEventHandler;
} = {
  [LinearEventType.AppUserNotification]: appUserNotification,
  [LinearEventType.Comment]: comment,
  [LinearEventType.OAuthApp]: oauthApp,
};

export default eventHandlers;
