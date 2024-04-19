import { cva } from 'class-variance-authority';

export const avatar = cva('rounded-full !leading-normal', {
  variants: {
    size: {
      small: 'size-5 text-2xs',
      medium: 'size-6 text-xs',
      large: 'size-8 text-sm',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
