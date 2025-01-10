import { z } from 'zod';

import { TaskCreateInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const taskCreateSchema = z.object<ZodInferSchema<TaskCreateInput>>({
  title: z.string().trim().min(5),
  content: z.string().trim().nullish(),
  bot_installation_id: z.number().int().positive(),
  repo_id: z.number().int().positive(),
});
