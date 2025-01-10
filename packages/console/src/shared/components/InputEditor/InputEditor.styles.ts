import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import Typography from '../Typography';

import { InputEditorStyledProps } from './types';

export const Content = tw.div<
  TwcComponentProps<'div'> & InputEditorStyledProps
>(({ $error, $disabled }) => [
  '[&_.tiptap]:min-h-20 [&_.tiptap]:w-full [&_.tiptap]:rounded-md [&_.tiptap]:bg-neutral-100 [&_.tiptap]:p-2 [&_.tiptap]:ring-1 [&_.tiptap]:ring-neutral-500 focus:[&_.tiptap]:bg-white focus:[&_.tiptap]:outline-none focus:[&_.tiptap]:ring-2 focus:[&_.tiptap]:ring-neutral-500',
  '[&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_p.is-editor-empty:first-child::before]:text-neutral-400 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
  $error && '[&_.tiptap]:ring-red-500',
  $disabled &&
    '[&_.tiptap]:cursor-not-allowed [&_.tiptap]:bg-neutral-300 [&_.tiptap]:opacity-50 [&_.tiptap]:ring-0',
]);

export const Text = tw(Typography)<
  TwcComponentProps<typeof Typography> & InputEditorStyledProps
>(({ $error }) => ['h-4 text-neutral-500', $error && 'text-red-600']);
