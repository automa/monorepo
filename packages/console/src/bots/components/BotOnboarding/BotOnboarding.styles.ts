import { tw } from 'theme';

import { Button, Flex, Typography } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})`max-w-lg lg:max-w-xl mx-auto gap-12 lg:gap-16 pt-20 short:pt-12 lg:pt-28`;

export const Card = tw(Button).attrs({
  variant: 'secondary',
})`py-3 px-4 lg:py-4 lg:px-6 h-full rounded-lg`;

export const Content = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`w-32 gap-3 lg:gap-4`;

export const BotName = tw(Typography)`lg:font-medium`;
