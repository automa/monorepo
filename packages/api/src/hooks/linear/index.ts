import { LinearEventType, LinearEventHandler } from './types';

import comment from './comment';

export const eventHandlers: {
  [type in LinearEventType]: LinearEventHandler;
} = {
  [LinearEventType.Comment]: comment,
};

export default eventHandlers;
