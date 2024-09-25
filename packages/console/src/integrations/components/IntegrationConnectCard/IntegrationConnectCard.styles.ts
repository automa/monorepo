import { tw } from 'theme';

import { Flex, Typography } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
})`w-180 gap-6 rounded-md bg-white p-6 shadow-card`;

export const OrgInfo = tw(Typography).attrs({
  variant: 'small',
})`rounded-md bg-green-600 px-3 py-2 lg:text-xs text-white`;

export const UserInfo = tw(Typography).attrs({
  variant: 'small',
})`rounded-md bg-neutral-100 px-3 py-2 text-neutral-600`;
