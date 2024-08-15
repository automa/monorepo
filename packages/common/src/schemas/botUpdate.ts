import { z } from 'zod';

import { BotUpdateInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const botUpdateSchema = z.object<ZodInferSchema<BotUpdateInput>>({
  short_description: z.string().trim().min(3).max(255).optional(),
  description: z.string().trim().nullish(),
  webhook_url: z.string().url().trim().optional(),
});
