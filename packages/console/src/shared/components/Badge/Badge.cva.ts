import { cva } from 'class-variance-authority';

export const badge = cva(
  'inline-flex items-center rounded px-2 py-1 text-xs font-semibold ring-1 ring-inset',
  {
    variants: {
      variant: {
        primary: 'bg-gray-50 text-gray-600 ring-gray-500/30',
        success: 'bg-green-50 text-green-600 ring-green-500/30',
        warning: 'bg-yellow-50 text-yellow-600 ring-yellow-500/30',
        error: 'bg-red-50 text-red-600 ring-red-500/30',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);
