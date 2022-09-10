import { Meta } from '@storybook/react';

import Typography from './Typography';

export default {
  title: 'Typography',
  component: Typography,
  argTypes: {},
} as Meta;

export const Default = {
  args: {
    children: 'This is text',
  },
};

export const Title1 = {
  args: {
    ...Default.args,
    variant: 'title1',
  },
};

export const Title2 = {
  args: {
    ...Default.args,
    variant: 'title2',
  },
};

export const Title3 = {
  args: {
    ...Default.args,
    variant: 'title3',
  },
};

export const Title4 = {
  args: {
    ...Default.args,
    variant: 'title4',
  },
};

export const Title5 = {
  args: {
    ...Default.args,
    variant: 'title5',
  },
};

export const Title6 = {
  args: {
    ...Default.args,
    variant: 'title6',
  },
};

export const Link = {
  args: {
    ...Default.args,
    variant: 'link1',
  },
};

export const LinkCustom = {
  args: {
    ...Default.args,
    link: 'true',
  },
};

export const Color = {
  args: {
    ...Default.args,
    color: 'body',
  },
};

export const ColorNative = {
  args: {
    ...Default.args,
    color: 'red',
  },
};

export const Ellipsis = {
  args: {
    ...Default.args,
    ellipsis: {
      width: '50px',
    },
  },
};

export const AlignLeft = {
  args: {
    ...Default.args,
    textAlign: 'left',
  },
};

export const AlignCenter = {
  args: {
    ...Default.args,
    textAlign: 'center',
  },
};

export const AlignRight = {
  args: {
    ...Default.args,
    textAlign: 'right',
  },
};

export const Uppercase = {
  args: {
    ...Default.args,
    textTransform: 'uppercase',
  },
};

export const Whitespace = {
  args: {
    ...Default.args,
    whiteSpace: 'nowrap',
    style: {
      width: '50px',
    },
  },
};

export const WordBreak = {
  args: {
    ...Default.args,
    wordBreak: 'break-all',
    style: {
      width: '25px',
    },
  },
};
