import { tw } from 'theme';

import { Button, Flex, Typography } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`pt-20 md:pt-24 lg:short:pt-24 lg:pt-32 gap-20 md:gap-32 lg:gap-48`;

export const Section = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`gap-4 lg:gap-6`;

export const Title = tw(Typography).attrs({
  variant: 'title1',
  align: 'center',
})`hero:max-w-4xl !leading-normal md:text-5xl text-3xl max-w-72`;

export const Subtitle = tw(Typography).attrs({
  variant: 'title5',
  align: 'center',
})`max-w-4xl md:text-xl text-base text-neutral-500`;

export const HeroButton = tw(Button)`h-12 px-6 text-md md:text-lg`;

export const HeroImageTextWrapper = tw.div`relative mt-2 w-full`;

export const HeroImageText = tw(Typography).attrs({
  variant: 'title4',
  align: 'center',
})`opacity-0 absolute top-0 left-1/2 -translate-x-1/2 w-full md:text-2xl text-xl`;

export const SectionTitle = tw(Typography).attrs({
  variant: 'title3',
  align: 'center',
})`text-neutral-900`;

export const SectionSubtitle = tw(Typography).attrs({
  variant: 'title6',
  align: 'center',
})`text-neutral-400 max-w-2xl leading-relaxed`;
