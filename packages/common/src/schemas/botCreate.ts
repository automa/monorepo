import { z } from 'zod';

import { RESTRICTED_BOT_NAMES } from '../consts';
import { BotCreateInput, BotType } from '../graphql';

import { ZodInferSchema } from './utils';

export const botCreateSchema = z.object<ZodInferSchema<BotCreateInput>>({
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
      message: 'Must not be a reserved name',
    }),
  type: z.nativeEnum(BotType),
  webhook_url: z.string().url().trim(),
  short_description: z.string().trim().min(3).max(255),
  draft_paths: z.array(z.string().trim()),
  description: z
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .nullish(),
  homepage: z
    .string()
    .url()
    .trim()
    .or(z.literal(''))
    .transform((value) => (value === '' ? null : value))
    .nullish(),
});
