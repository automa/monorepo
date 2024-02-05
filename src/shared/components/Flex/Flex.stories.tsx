import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { userEvent, within } from '@storybook/testing-library';

import Flex from './Flex';
import { FlexProps } from './types';

const meta = {
  title: 'Flex',
  component: (props) => <Flex {...props} />,
  args: {
    children: (
      <>
        <div>One</div>
        <div>Two</div>
      </>
    ),
  },
  argTypes: {
    onClick: {
      action: true,
    },
  },
} satisfies Meta<FlexProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Gap = {
  args: {
    gap: 2,
  },
} satisfies Story;

export const Clickable = {
  play: async ({ args, canvasElement }) => {
    const { getByText } = within(canvasElement);

    await userEvent.click(getByText('One'));
    expect(args.onClick).toHaveBeenCalled();
  },
} satisfies Story;
