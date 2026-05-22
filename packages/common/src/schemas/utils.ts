import { z, ZodObject } from 'zod';

export type ZodInferSchema<T extends object> = ZodObject<{
  [Key in keyof T]-?: any extends T[Key]
    ? z.ZodType<T[Key]>
    : undefined extends T[Key]
      ? z.ZodOptional<z.ZodType<T[Key]>>
      : z.ZodType<T[Key]>;
}>;
