import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})`mx-auto max-w-lg gap-12 pt-20 lg:max-w-xl lg:gap-16 lg:pt-28 short:pt-12`;
