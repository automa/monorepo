import { QueryResolvers } from '@automa/common';

import { Context } from '../types';

export const Query: QueryResolvers<Context> = {
  me: (root, args, { user }) => {
    return user;
  },
};
