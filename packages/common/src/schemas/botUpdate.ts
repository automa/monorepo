import { z } from 'zod';

import { BotUpdateInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const botUpdateSchema = z.object<ZodInferSchema<BotUpdateInput>>({
  webhook_url: z.string().url().trim().optional(),
  short_description: z.string().trim().min(3).max(255).optional(),
  draft_paths: z.array(z.string().trim()).optional(),
  description: z.object({}).passthrough().nullish(),
  homepage: z
    .string()
    .url()
    .trim()
    .or(z.literal(''))
    .transform((value) => (value === '' ? null : value))
    .nullish(),
});
