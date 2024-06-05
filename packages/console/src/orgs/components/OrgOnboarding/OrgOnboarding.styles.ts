import { tw } from 'theme';

import { Button, Flex } from 'shared';

export const Container = tw(Flex).attrs({
  direction: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})`max-w-lg lg:max-w-xl mx-auto gap-12 lg:gap-16 mt-20 lg:mt-28`;

export const Card = tw(Button).attrs({
  variant: 'secondary',
})`py-6 px-10 lg:py-8 lg:px-12 h-full rounded-lg `;
