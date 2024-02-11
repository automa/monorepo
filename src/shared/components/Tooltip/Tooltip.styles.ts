import * as Tooltip from '@radix-ui/react-tooltip';

import { tw } from 'theme';

export const Container = tw.div``;

export const TriggerContainer = tw.div``;

export const Content = tw(
  Tooltip.Content,
)`rounded-md bg-black px-3 py-1.5 text-white text-xs z-50`;

export const Arrow = tw(Tooltip.Arrow)`fill-black`;
