import { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';

import Accordion, { AccordionItem } from './Accordion';

const meta = {
  title: 'Accordion',
  component: Accordion,
  args: {
    children: (
      <>
        <AccordionItem value="item-1" trigger="One">
          Content for item one.
        </AccordionItem>
        <AccordionItem value="item-2" trigger="Two">
          Content for item two.
        </AccordionItem>
        <AccordionItem value="item-3" trigger="Three">
          Content for item three.
        </AccordionItem>
      </>
    ),
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  play: async ({ canvasElement }) => {
    const { getByText, queryByText } = within(canvasElement);

    expect(queryByText('Content for item one.')).not.toBeInTheDocument();
    expect(queryByText('Content for item two.')).not.toBeInTheDocument();

    await userEvent.click(getByText('One'));

    expect(getByText('Content for item one.')).toBeVisible();
    expect(queryByText('Content for item two.')).not.toBeInTheDocument();

    await userEvent.click(getByText('Two'));

    expect(getByText('Content for item one.')).toBeVisible();
    expect(getByText('Content for item two.')).toBeVisible();
  },
} satisfies Story;

export const Values = {
  args: {
    defaultValue: ['item-1', 'item-2'],
  },
  play: async ({ canvasElement }) => {
    const { getByText, queryByText } = within(canvasElement);

    expect(getByText('Content for item one.')).toBeVisible();
    expect(getByText('Content for item two.')).toBeVisible();
    expect(queryByText('Content for item three.')).not.toBeInTheDocument();
  },
} satisfies Story;

export const Single = {
  args: {
    type: 'single',
  },
  play: async ({ canvasElement }) => {
    const { getByText, queryByText } = within(canvasElement);

    expect(queryByText('Content for item one.')).not.toBeInTheDocument();
    expect(queryByText('Content for item two.')).not.toBeInTheDocument();

    await userEvent.click(getByText('One'));

    expect(getByText('Content for item one.')).toBeVisible();
    expect(queryByText('Content for item two.')).not.toBeInTheDocument();

    await userEvent.click(getByText('Two'));

    expect(queryByText('Content for item one.')).not.toBeInTheDocument();
    expect(getByText('Content for item two.')).toBeVisible();
  },
} satisfies Story;

export const SingleValues = {
  args: {
    ...Single.args,
    defaultValue: 'item-1',
  },
} satisfies Story;

export const SingleNonCollapsible = {
  args: {
    ...Single.args,
    collapsible: false,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const { getByText, queryByText } = within(canvasElement);

    expect(queryByText('Content for item one.')).not.toBeInTheDocument();

    await userEvent.click(getByText('One'));

    expect(queryByText('Content for item one.')).not.toBeInTheDocument();
  },
} satisfies Story;

export const ItemDisabled = {
  args: {
    children: (
      <>
        <AccordionItem value="item-1" trigger="One">
          Content for item one.
        </AccordionItem>
        <AccordionItem value="item-2" trigger="Two" disabled>
          Content for item two.
        </AccordionItem>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const { getByText, queryByText } = within(canvasElement);

    expect(queryByText('Content for item one.')).not.toBeInTheDocument();
    expect(queryByText('Content for item two.')).not.toBeInTheDocument();

    await userEvent.click(getByText('One'));

    expect(queryByText('Content for item one.')).toBeVisible();
    expect(queryByText('Content for item two.')).not.toBeInTheDocument();

    await userEvent.click(getByText('Two'));

    expect(queryByText('Content for item one.')).toBeVisible();
    expect(queryByText('Content for item two.')).not.toBeInTheDocument();
  },
} satisfies Story;
