import * as HoverCard from '@radix-ui/react-hover-card';

import { tw } from 'theme';

export const Container = tw.div``;

export const Content = tw(
  HoverCard.Content,
)`z-50 bg-white p-3 rounded-md shadow-menu duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`;
