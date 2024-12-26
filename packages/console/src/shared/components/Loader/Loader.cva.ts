import { cva } from 'class-variance-authority';

export const loader = cva('', {
  variants: {
    size: {
      medium: 'size-20',
      small: 'size-8',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
