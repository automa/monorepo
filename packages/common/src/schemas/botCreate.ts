import { z } from 'zod';

import { RESTRICTED_BOT_NAMES } from '../consts';
import { BotCreateInput, BotType } from '../graphql';

import { ZodInferSchema } from './utils';

export const botCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(255)
    .regex(
      /^[a-z0-9-]+$/i,
      'Must only contain alphanumeric characters and dashes',
    )
    .refine((value) => !RESTRICTED_BOT_NAMES.includes(value), {
      error: 'Must not be a reserved name',
    }),
  type: z.enum(BotType),
  webhook_url: z.url().trim(),
  short_description: z.string().trim().min(3).max(255),
  draft_paths: z.array(z.string().trim()),
  description: z.looseObject({}).nullish(),
  homepage: z
    .url()
    .trim()
    .or(z.literal(''))
    .nullish()
    .overwrite((value) => (value === '' ? null : value)),
}) satisfies ZodInferSchema<BotCreateInput>;
