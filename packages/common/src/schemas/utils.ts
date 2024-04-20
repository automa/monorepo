import { z } from 'zod';

export type ZodInferSchema<T extends object> = {
  [Key in keyof T]-?: undefined extends T[Key]
    ? z.ZodOptionalType<z.ZodNullableType<z.ZodType<T[Key]>>>
    : z.ZodType<T[Key]>;
};
