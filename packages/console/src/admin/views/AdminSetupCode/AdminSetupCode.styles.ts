import { tw } from 'theme';

import { Button, Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})``;

export const Card = tw(Button).attrs({
  variant: 'secondary',
})`py-6 px-10 lg:py-8 lg:px-12 h-full rounded-lg`;
