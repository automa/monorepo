import { cva } from 'class-variance-authority';

import { twp } from 'theme';

export const button = cva(twp`flex cursor-pointer items-center`, {
  variants: {
    variant: {
      primary: '',
      secondary: '',
      tertiary: '',
    },
    size: {
      small: '',
      medium: '',
      large: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});
