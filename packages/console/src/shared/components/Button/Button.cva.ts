import { cva } from 'class-variance-authority';

export const button = cva(
  'inline-flex cursor-pointer items-center whitespace-nowrap rounded-md text-sm font-semibold shadow transition-colors focus-visible:outline-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/80',
        secondary: 'border-2 border-primary text-primary hover:bg-primary/10',
        tertiary: 'bg-primary/10 text-primary hover:bg-primary/20',
        ghost: 'text-primary shadow-none hover:bg-primary/10',
        ghostActive: 'bg-primary/10 text-primary shadow-none',
        danger: 'bg-accent text-white hover:bg-accent/80',
      },
      size: {
        xsmall: 'h-6 px-1 text-xs font-bold',
        small: 'h-8 px-3 text-xs font-bold',
        medium: 'h-9 px-4 py-2',
        large: 'h-10 px-8',
      },
      icon: {
        true: 'justify-center p-0 *:size-4',
        false: '',
      },
    },
    compoundVariants: [
      {
        size: 'xsmall',
        icon: true,
        class: 'size-6',
      },
      {
        size: 'small',
        icon: true,
        class: 'size-8',
      },
      {
        size: 'medium',
        icon: true,
        class: 'size-9',
      },
      {
        size: 'large',
        icon: true,
        class: 'size-10 *:size-5',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
      icon: false,
    },
  },
);
