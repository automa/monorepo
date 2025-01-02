import { JSONContent } from '@tiptap/react';

export interface EditorProps {
  editable?: boolean;
  value?: JSONContent | null;
  onChange?: (value: JSONContent | null) => void;
  placeholder?: string;
}
