import { tw } from 'theme';

import { Flex, Typography } from 'components';

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
})`md:max-w-full max-w-xs !leading-normal md:text-5xl text-3xl`;

export const Subtitle = tw(Typography).attrs({
  variant: 'title5',
  align: 'center',
})`max-w-4xl md:text-xl text-base text-neutral-500`;

export const HeroImageTextWrapper = tw.div`relative mt-2 w-full`;

export const HeroImageText = tw(Typography).attrs({
  variant: 'title4',
  align: 'center',
})`opacity-0 absolute top-0 left-1/2 -translate-x-1/2 w-full md:text-2xl text-xl`;

export const SectionTitle = tw(Typography).attrs({
  variant: 'title2',
  align: 'center',
})`md:text-4xl text-2xl`;

export const SectionSubtitle = tw(Typography).attrs({
  variant: 'title6',
  align: 'center',
})`text-neutral-500 md:text-lg text-base lg:max-w-7xl md:max-w-xl`;

export const BentoGrid = tw.div`mt-8 grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6 xl:gap-8`;

export const BentoCard = tw.div`overflow-hidden rounded-2xl border border-neutral-200/60 bg-gradient-to-br from-white to-neutral-50/30 p-6 shadow-sm backdrop-blur-sm hover:border-neutral-400/80 hover:shadow-xl hover:shadow-neutral-200/20 lg:p-8`;

export const BentoCardContent = tw(Flex).attrs({
  direction: 'column',
})`h-full gap-2 lg:gap-4`;

export const BentoCardTitle = tw(Typography).attrs({
  variant: 'title4',
})`md:text-2xl text-xl tracking-normal`;

export const BentoCardSubtitle = tw(
  Typography,
)`text-neutral-500 pt-cal-sans font-display tracking-wide flex-1 md:text-sm text-xs md:min-h-12 max-h-13`;

export const BentoCardImage = tw(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`h-full`;
