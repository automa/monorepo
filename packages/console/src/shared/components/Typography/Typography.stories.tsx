import { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';

import { TypographyComponentProps } from './types';

import Typography from './Typography';

const meta = {
  title: 'Typography',
  component: Typography,
  args: {
    children: 'One two',
    onClick: fn(),
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
} satisfies Story;

export const Large = {
  args: {
    variant: 'large',
  },
} satisfies Story;

export const Small = {
  args: {
    variant: 'small',
  },
} satisfies Story;

export const Uppercase = {
  args: {
    transform: 'uppercase',
  },
} satisfies Story;

export const Lowercase = {
  args: {
    transform: 'lowercase',
  },
} satisfies Story;

export const Capitalize = {
  args: {
    transform: 'capitalize',
  },
} satisfies Story;

export const AlignLeft = {
  args: {
    align: 'left',
  },
} satisfies Story;

export const AlignCenter = {
  args: {
    align: 'center',
  },
} satisfies Story;

export const AlignRight = {
  args: {
    align: 'right',
  },
} satisfies Story;

export const AlighJustify = {
  args: {
    align: 'justify',
  },
} satisfies Story;

export const Whitespace = {
  args: {
    whitespace: 'nowrap',
    style: {
      width: '50px',
    },
  },
} satisfies Story;

export const Link = {
  args: {
    link: true,
  },
} satisfies Story;

export const Clickable = {
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One two'));
    expect(args.onClick).toHaveBeenCalled();
  },
} satisfies Story;
