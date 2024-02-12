import { cva } from 'class-variance-authority';

export const typography = cva('', {
  variants: {
    variant: {
      large: 'text-lg font-semibold lg:text-xl',
      medium: 'text-base lg:text-lg',
      small: 'text-sm font-medium lg:text-base',
      title1: 'text-6xl font-bold lg:text-7xl',
      title2: 'text-5xl font-bold lg:text-6xl',
      title3: 'text-4xl font-bold lg:text-5xl',
      title4: 'text-3xl font-semibold lg:text-4xl',
      title5: 'text-2xl font-semibold lg:text-3xl',
      title6: 'text-xl font-semibold lg:text-2xl',
    },
    transform: {
      none: 'normal-case',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    whitespace: {
      normal: 'whitespace-normal',
      nowrap: 'whitespace-nowrap',
      pre: 'whitespace-pre',
      'pre-line': 'whitespace-pre-line',
      'pre-wrap': 'whitespace-pre-wrap',
      'break-spaces': 'whitespace-break-spaces',
    },
  },
  defaultVariants: {
    variant: 'medium',
  },
});
