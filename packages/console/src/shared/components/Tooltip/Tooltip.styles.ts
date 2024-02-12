import * as Tooltip from '@radix-ui/react-tooltip';

import { tw } from 'theme';

export const Container = tw.div``;

export const Trigger = tw.div``;

export const Content = tw(
  Tooltip.Content,
)`z-50 overflow-hidden rounded-md bg-primary dark:bg-primary/10 px-3 py-1.5 text-sm font-medium text-white dark:text-black animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;

export const Arrow = tw(Tooltip.Arrow)`fill-black`;
