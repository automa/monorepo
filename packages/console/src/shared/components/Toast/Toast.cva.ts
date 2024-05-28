import { cva } from 'class-variance-authority';

export const toast = cva(
  'pointer-events-auto rounded-lg border-b-4 bg-neutral-800 px-4 py-3 text-sm font-medium text-white shadow-tooltip',
  {
    variants: {
      variant: {
        info: 'border-blue-500',
        success: 'border-green-500',
        error: 'border-red-500',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export const toastTitle = cva('', {
  variants: {
    variant: {
      info: '',
      success: '',
      error: '',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export const toastDescription = cva('', {
  variants: {
    variant: {
      info: '',
      success: '',
      error: '',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export const toastAction = cva('', {
  variants: {
    variant: {
      info: '',
      success: '',
      error: '',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

export const toastClose = cva('', {
  variants: {
    variant: {
      info: '',
      success: '',
      error: '',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});
