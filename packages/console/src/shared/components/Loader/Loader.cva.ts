import { cva } from 'class-variance-authority';

export const loader = cva('', {
  variants: {
    size: {
      medium: '',
      small: '',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
