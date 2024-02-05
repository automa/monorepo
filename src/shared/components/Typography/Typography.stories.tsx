import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

import Typography from './Typography';
import { TypographyComponentProps } from './types';

const meta = {
  title: 'Typography',
  component: (props) => <Typography {...props} />,
  args: {
    children: 'One',
  },
  argTypes: {
    onClick: {
      action: true,
    },
  },
} satisfies Meta<TypographyComponentProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Title1 = {
  args: {
    variant: 'title1',
  },
} satisfies Story;

export const Title2 = {
  args: {
    variant: 'title2',
  },
} satisfies Story;

export const Title3 = {
  args: {
    variant: 'title3',
  },
} satisfies Story;

export const Title4 = {
  args: {
    variant: 'title4',
  },
} satisfies Story;

export const Title5 = {
  args: {
    variant: 'title5',
  },
} satisfies Story;

export const Title6 = {
  args: {
    variant: 'title6',
  },
};

export const Body1 = {
  args: {
    variant: 'body1',
  },
} satisfies Story;

export const Body2 = {
  args: {
    variant: 'body2',
  },
} satisfies Story;

export const Body3 = {
  args: {
    variant: 'body3',
  },
};

export const Link = {
  args: {
    link: true,
  },
} satisfies Story;

export const Color = {
  args: {
    color: 'body',
  },
} satisfies Story;

export const ColorNative = {
  args: {
    color: 'red',
  },
} satisfies Story;

export const Ellipsis = {
  args: {
    ellipsis: {
      width: '50px',
    },
  },
} satisfies Story;

export const AlignLeft = {
  args: {
    textAlign: 'left',
  },
} satisfies Story;

export const AlignCenter = {
  args: {
    textAlign: 'center',
  },
} satisfies Story;

export const AlignRight = {
  args: {
    textAlign: 'right',
  },
} satisfies Story;

export const Uppercase = {
  args: {
    textTransform: 'uppercase',
  },
} satisfies Story;

export const Whitespace = {
  args: {
    whiteSpace: 'nowrap',
    style: {
      width: '50px',
    },
  },
} satisfies Story;

export const WordBreak = {
  args: {
    wordBreak: 'break-all',
    style: {
      width: '25px',
    },
  },
} satisfies Story;

export const Clickable = {
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).toHaveBeenCalled();
  },
} satisfies Story;
