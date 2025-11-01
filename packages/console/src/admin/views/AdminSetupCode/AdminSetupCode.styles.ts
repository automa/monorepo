import { tw } from 'theme';

import { Button, Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
  justifyContent: 'center',
})``;

export const Card = tw(Button).attrs({
  variant: 'secondary',
})`h-full rounded-lg px-10 py-6 lg:px-12 lg:py-8`;
