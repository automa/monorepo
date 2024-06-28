import { cva } from 'class-variance-authority';

export const toggleGroup = cva(
  'inline-flex w-fit cursor-pointer items-center border-y border-r border-primary font-medium first:rounded-l first:border-l last:rounded-r disabled:cursor-default',
  {
    variants: {
      variant: {
        primary:
          'data-on:bg-primary data-on:text-white data-off:bg-white data-off:text-black data-on:hover:bg-primary/80 data-off:hover:bg-primary/10 disabled:bg-opacity-50 disabled:text-opacity-50',
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
