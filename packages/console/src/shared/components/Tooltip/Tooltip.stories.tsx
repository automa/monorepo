import { Meta, StoryObj } from '@storybook/react';

import Tooltip from './Tooltip';
import { TooltipComponentProps } from './types';

const meta = {
  title: 'Tooltip',
  component: (props) => <Tooltip {...props} />,
  args: {
    children: 'Children',
    body: 'Content',
  },
} satisfies Meta<TooltipComponentProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const Node = {
  args: {
    body: <div>Content</div>,
  },
} satisfies Story;
