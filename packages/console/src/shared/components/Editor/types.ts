import { JSONContent } from '@tiptap/react';

export interface EditorProps {
  editable?: boolean;
  value?: JSONContent | string | null;
  onChange?: (value: JSONContent | null) => void;
  onChangeAsMarkdown?: (value: string | null) => void;
  placeholder?: string;
}
