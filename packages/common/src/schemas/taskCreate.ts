import { z } from 'zod';

import { TaskCreateInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const taskCreateSchema = z.object<ZodInferSchema<TaskCreateInput>>({
  content: z.string().trim().min(5),
});
