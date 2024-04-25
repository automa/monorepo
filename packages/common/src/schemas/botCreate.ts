import { z } from 'zod';

import { BotCreateInput, BotType } from '../graphql';
import { ZodInferSchema } from './utils';

export const botCreateSchema = z.object<ZodInferSchema<BotCreateInput>>({
  name: z
    .string()
    .min(3)
    .max(255)
    .regex(
      /^[a-z0-9-]+$/i,
      'Must only contain alphanumeric characters and dashes',
    ),
  description: z.string().nullish(),
  type: z.nativeEnum(BotType),
  webhook_url: z.string().url().nullish(),
});
