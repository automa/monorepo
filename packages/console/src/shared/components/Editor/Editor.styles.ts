import { BubbleMenu } from '@tiptap/react';

import { tw } from 'theme';

export const BubbleMenuContainer = tw(
  BubbleMenu,
)`flex flex-row items-center justify-center gap-1 rounded-md bg-neutral-50 p-1 shadow-menu`;
