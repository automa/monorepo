import { z } from 'zod';

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
    ),
  short_description: z.string().trim().min(3).max(255),
  description: z.string().trim().nullish(),
  type: z.nativeEnum(BotType),
  webhook_url: z.string().url().trim(),
});
