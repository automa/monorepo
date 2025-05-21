import React, { useEffect } from 'react';
import {
  CodeBlock,
  CodeSimple,
  LinkBreak,
  ListBullets,
  ListNumbers,
  Quotes,
  TextB,
  TextHFour,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
  TextStrikethrough,
} from '@phosphor-icons/react';
import TiptapHeading, { Level } from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import {
  EditorContent,
  EditorOptions,
  mergeAttributes,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';

import { twp } from 'theme';

import Button from '../Button';
import Tooltip from '../Tooltip';
import { TypographyComponentProps } from '../Typography';
import { typography } from '../Typography/Typography.cva';

import { EditorProps } from './types';

import { BubbleMenuContainer } from './Editor.styles';

const Heading = TiptapHeading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level = hasLevel
      ? (node.attrs.level as Level)
      : this.options.levels[0];

    let variant: TypographyComponentProps['variant'] = 'medium';

    switch (level) {
      case 1:
        variant = 'title4';
        break;

      case 2:
        variant = 'title5';
        break;

      case 3:
        variant = 'title6';
        break;

      case 4:
        variant = 'xlarge';
        break;

      default:
        break;
    }

    return [
      `h${level}`,
      mergeAttributes(HTMLAttributes, {
        class: `mb-2 ${typography({ variant })}`,
      }),
      0,
    ];
  },
});

// TODO: Add slash command
const Editor: React.FC<EditorProps> = ({
  editable = true,
  value = null,
  onChange,
  onChangeAsMarkdown,
  placeholder,
}) => {
  const handleUpdate: EditorOptions['onUpdate'] = ({ editor }) => {
    if (!editor.getText().trim().length) {
      return (onChange ?? onChangeAsMarkdown)?.(null);
    }

    return (
      onChange?.(editor.getJSON()) ??
      onChangeAsMarkdown?.(editor.storage.markdown.getMarkdown())
    );
  };

  const editor = useEditor({
    editable,
    onUpdate: handleUpdate,
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: {
          HTMLAttributes: {
            class: twp`mb-2`,
          },
        },
        code: {
          HTMLAttributes: {
            class: twp`rounded-md bg-neutral-200 px-1.5 py-0.5`,
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: twp`my-4 border-t-2 border-neutral-200`,
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: twp`border-l-4 border-neutral-200 pl-4`,
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: twp`mb-2 list-inside list-disc`,
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: twp`mb-2 list-inside list-decimal`,
          },
        },
        listItem: {
          HTMLAttributes: {
            class: twp`[&_p]:inline`,
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: twp`mb-2 rounded-md bg-neutral-200 p-2`,
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      Link.configure({
        HTMLAttributes: {
          class: twp`cursor-pointer text-blue-500 underline`,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        HTMLAttributes: {
          class: twp`my-6 border-collapse [&_p]:mb-0`,
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: twp`border border-neutral-200 bg-neutral-200 px-2 py-1.5 font-bold [&.selectedCell]:bg-neutral-300`,
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: twp`border border-neutral-200 px-2 py-1.5 [&.selectedCell]:bg-neutral-200`,
        },
      }),
      Markdown,
    ],
  });

  // Setting value every time the value changes causes the cursor to jump to the end of the text
  // and if the editor is being used for markdown, the ending spaces are removed too
  useEffect(() => {
    if (!editor || !value) {
      return;
    }

    editor.commands.setContent(value);
  }, []);

  return (
    <>
      <BubbleMenuContainer editor={editor}>
        <Tooltip body="Bold">
          <Button
            variant={editor?.isActive('bold') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <TextB weight="bold" />
          </Button>
        </Tooltip>
        <Tooltip body="Italic">
          <Button
            variant={editor?.isActive('italic') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <TextItalic />
          </Button>
        </Tooltip>
        <Tooltip body="Strikethrough">
          <Button
            variant={editor?.isActive('strike') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <TextStrikethrough />
          </Button>
        </Tooltip>
        <Tooltip body="Inline code">
          <Button
            variant={editor?.isActive('code') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleCode().run()}
          >
            <CodeSimple />
          </Button>
        </Tooltip>
        {/* TODO: Add link */}
        {editor?.isActive('link') && (
          <Tooltip body="Remove link">
            <Button
              variant="ghostActive"
              size="xsmall"
              icon
              onClick={() => editor?.chain().focus().unsetLink().run()}
            >
              <LinkBreak />
            </Button>
          </Tooltip>
        )}
        <Tooltip body="Blockquote">
          <Button
            variant={editor?.isActive('blockquote') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            <Quotes />
          </Button>
        </Tooltip>
        <Tooltip body="Heading 1">
          <Button
            variant={
              editor?.isActive('heading', { level: 1 })
                ? 'ghostActive'
                : 'ghost'
            }
            size="xsmall"
            icon
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <TextHOne />
          </Button>
        </Tooltip>
        <Tooltip body="Heading 2">
          <Button
            variant={
              editor?.isActive('heading', { level: 2 })
                ? 'ghostActive'
                : 'ghost'
            }
            size="xsmall"
            icon
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <TextHTwo />
          </Button>
        </Tooltip>
        <Tooltip body="Heading 3">
          <Button
            variant={
              editor?.isActive('heading', { level: 3 })
                ? 'ghostActive'
                : 'ghost'
            }
            size="xsmall"
            icon
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <TextHThree />
          </Button>
        </Tooltip>
        <Tooltip body="Heading 4">
          <Button
            variant={
              editor?.isActive('heading', { level: 4 })
                ? 'ghostActive'
                : 'ghost'
            }
            size="xsmall"
            icon
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 4 }).run()
            }
          >
            <TextHFour />
          </Button>
        </Tooltip>
        <Tooltip body="List">
          <Button
            variant={editor?.isActive('bulletList') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <ListBullets />
          </Button>
        </Tooltip>
        <Tooltip body="Numbered list">
          <Button
            variant={editor?.isActive('orderedList') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListNumbers />
          </Button>
        </Tooltip>
        <Tooltip body="Code block">
          <Button
            variant={editor?.isActive('codeBlock') ? 'ghostActive' : 'ghost'}
            size="xsmall"
            icon
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          >
            <CodeBlock />
          </Button>
        </Tooltip>
      </BubbleMenuContainer>
      <EditorContent editor={editor} />
    </>
  );
};

export default Editor;
