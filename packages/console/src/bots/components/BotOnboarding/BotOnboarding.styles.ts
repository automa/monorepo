import { tw } from 'theme';

import { Button, Flex, Typography } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})`mx-auto max-w-lg gap-12 pt-20 lg:max-w-xl lg:gap-16 lg:pt-28 short:pt-12`;

export const Card = tw(Button).attrs({
  variant: 'secondary',
})`h-full rounded-lg px-4 py-3 lg:px-6 lg:py-4`;

export const Content = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`w-32 gap-3 lg:gap-4`;

export const BotName = tw(Typography)`lg:font-medium`;
