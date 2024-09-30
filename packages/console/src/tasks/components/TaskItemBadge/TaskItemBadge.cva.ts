import { cva } from 'class-variance-authority';

export const taskItemBadge = cva(
  'flex w-fit items-center gap-1 rounded-lg py-1',
  {
    variants: {
      variant: {
        primary:
          'px-2 ring-1 ring-inset ring-neutral-400 hover:ring-neutral-600 *:hover:!text-neutral-800',
        secondary: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);
