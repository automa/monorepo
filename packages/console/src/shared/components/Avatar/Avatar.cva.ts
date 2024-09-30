import { cva } from 'class-variance-authority';

export const avatar = cva('!leading-normal', {
  variants: {
    variant: {
      circle: 'rounded-full',
      square: '',
    },
    size: {
      xxsmall: 'size-3 text-2xs',
      xsmall: 'size-4 text-2xs',
      small: 'size-5 text-2xs',
      medium: 'size-6 text-xs',
      large: 'size-8 text-sm',
    },
  },
  defaultVariants: {
    variant: 'circle',
    size: 'medium',
  },
});
