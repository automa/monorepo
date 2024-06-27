import { tw } from 'theme';

import { Flex } from 'shared';

export const Header = tw(Flex)`pt-4 pb-2 w-full gap-8 px-6 bg-white`;

// TODO: Make this a proper component?
export const EmptyTopNav = tw.div`h-11 w-full bg-white shadow-border`;
