import { z } from 'zod';

import { TaskMessageInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const taskMessageSchema = z.object<ZodInferSchema<TaskMessageInput>>({
  content: z.string().trim().min(5),
});
