import { cva } from 'class-variance-authority';

export const badge = cva(
  'inline-flex items-center rounded px-2 font-medium ring-1 ring-inset ',
  {
    variants: {
      variant: {
        primary: 'bg-gray-100 text-gray-700 ring-gray-500/30',
        success: 'bg-green-100 text-green-700 ring-green-500/30',
        warning: 'bg-yellow-100 text-yellow-700 ring-yellow-500/30',
        error: 'bg-red-100 text-red-700 ring-red-500/30',
      },
      size: {
        medium: 'h-5 text-2xs lg:text-xs',
        large: 'h-6 text-xs lg:text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  },
);
