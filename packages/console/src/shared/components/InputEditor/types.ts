import { HTMLAttributes } from 'react';

import { $, Component, Styled } from 'theme';

import { EditorProps } from '../Editor';

type InputEditorProps = $<
  {},
  {
    error?: string;
    disabled?: boolean;
  },
  {
    label: string;
    optional?: boolean;
    description?: string;
    name: string;
  } & Omit<EditorProps, 'editable'> &
    HTMLAttributes<HTMLDivElement>
>;

export type InputEditorComponentProps = Component<InputEditorProps>;

export type InputEditorStyledProps = Styled<InputEditorProps>;
