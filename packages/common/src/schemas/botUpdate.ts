import { z } from 'zod';

import { BotUpdateInput } from '../graphql';

import { ZodInferSchema } from './utils';

export const botUpdateSchema = z.object({
  webhook_url: z.url().trim().optional(),
  short_description: z.string().trim().min(3).max(255).optional(),
  draft_paths: z.array(z.string().trim()).optional(),
  description: z.looseObject({}).nullish(),
  homepage: z
    .url()
    .trim()
    .or(z.literal(''))
    .nullish()
    .overwrite((value) => (value === '' ? null : value)),
}) satisfies ZodInferSchema<BotUpdateInput>;
