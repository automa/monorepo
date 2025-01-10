import { z } from 'zod';

export type ZodInferSchema<T extends object> = {
  [Key in keyof T]-?: any extends T[Key]
    ? z.ZodType<T[Key]>
    : undefined extends T[Key]
    ? z.ZodOptionalType<z.ZodType<T[Key]>>
    : z.ZodType<T[Key]>;
};
