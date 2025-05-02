import { cva } from 'class-variance-authority';

export const typography = cva('', {
  variants: {
    variant: {
      large: '',
      medium: '',
      small: '',
      title1: '',
      title2: '',
      title3: '',
      title4: '',
      title5: '',
      title6: '',
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
    wordBreak: {
      normal: 'break-normal',
      all: 'break-all',
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
