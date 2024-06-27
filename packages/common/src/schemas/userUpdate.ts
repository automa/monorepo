import { z } from 'zod';

import { UserUpdateInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const userUpdateSchema = z.object<ZodInferSchema<UserUpdateInput>>({
  name: z.string().trim().min(3).max(255),
  email: z.string().trim().email(),
});
