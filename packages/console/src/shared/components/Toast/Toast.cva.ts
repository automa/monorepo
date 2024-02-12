import { cva } from 'class-variance-authority';

export const toast = cva('', {
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
