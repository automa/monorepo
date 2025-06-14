import { tw } from 'theme';

import { Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})`max-w-lg lg:max-w-xl mx-auto gap-12 lg:gap-16 pt-20 short:pt-12 lg:pt-28`;
