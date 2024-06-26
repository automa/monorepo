import { cva } from 'class-variance-authority';

export const toggleGroup = cva(
  'inline-flex w-fit cursor-pointer items-center font-medium',
  {
    variants: {
      variant: {
        primary: '',
      },
      size: {
        medium: 'px-2 py-0.5 text-xs lg:text-sm',
        large: 'px-3 py-1 text-sm lg:text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);
