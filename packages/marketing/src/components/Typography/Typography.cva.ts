import { cva } from 'class-variance-authority';

export const typography = cva('', {
  variants: {
    variant: {
      large: 'text-base lg:text-lg',
      medium: 'text-sm font-medium lg:text-base',
      small: 'text-xs font-medium lg:text-sm',
      title1: 'font-display text-5xl font-bold lg:text-6xl',
      title2: 'font-display text-4xl font-bold lg:text-5xl',
      title3: 'font-display text-3xl font-bold lg:text-4xl',
      title4: 'font-display text-2xl font-semibold tracking-wide lg:text-3xl',
      title5: 'font-display text-xl font-semibold tracking-wide lg:text-2xl',
      title6: 'font-display text-lg font-semibold tracking-wide lg:text-xl',
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
