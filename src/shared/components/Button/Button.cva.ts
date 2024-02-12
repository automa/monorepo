import { cva } from 'class-variance-authority';

export const button = cva('flex cursor-pointer items-center', {
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
