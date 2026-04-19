import { z } from 'zod';

import { UserUpdateInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const userUpdateSchema = z.object({
  name: z.string().trim().min(3).max(255),
  email: z.email().trim(),
}) satisfies ZodInferSchema<UserUpdateInput>;
