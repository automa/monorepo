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
    icon: {
      true: 'justify-center p-0',
      false: '',
    },
  },
  compoundVariants: [
    {
      size: 'small',
      icon: true,
      class: '',
    },
    {
      size: 'medium',
      icon: true,
      class: '',
    },
    {
      size: 'large',
      icon: true,
      class: '',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
    icon: false,
  },
});
