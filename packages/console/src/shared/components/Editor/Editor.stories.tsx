import { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';

import Editor from './Editor';

const meta = {
  title: 'Editor',
  component: (props) => {
    const [value, onChange] = useState(props.value);

    return <Editor {...props} value={value} onChange={onChange} />;
  },
  args: {
    placeholder: 'Editor',
    value: null,
    onChange: () => {},
  },
} satisfies Meta<typeof Editor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {} satisfies Story;

export const WithValue = {
  args: {
    value: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: {
            level: 1,
          },
          content: [
            {
              type: 'text',
              text: 'Heading 1',
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Heading 2',
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 3,
          },
          content: [
            {
              type: 'text',
              text: 'Heading 3',
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 4,
          },
          content: [
            {
              type: 'text',
              text: 'Heading 4',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Text ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'bold',
                },
              ],
              text: 'Bold',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'italic',
                },
              ],
              text: 'Italic',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'strike',
                },
              ],
              text: 'Strike',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'code',
                },
              ],
              text: 'Code',
            },
          ],
        },
        {
          type: 'horizontalRule',
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Blockquote',
                },
              ],
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'One',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Two',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'orderedList',
          attrs: {
            start: 1,
          },
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'One',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Two',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'codeBlock',
          attrs: {
            language: null,
          },
          content: [
            {
              type: 'text',
              text: 'Code\nBlock',
            },
          ],
        },
      ],
    },
  },
} satisfies Story;

export const NonEditable = {
  args: {
    ...WithValue.args,
    editable: false,
  },
} satisfies Story;
