import { tw } from 'theme';

import { Flex, Typography } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`gap-20 pt-20 md:gap-32 md:pt-24 lg:gap-48 lg:pt-32 lg:short:pt-24`;

export const Section = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`gap-4 lg:gap-6`;

export const Title = tw(Typography).attrs({
  variant: 'title1',
  align: 'center',
})`max-w-xs text-3xl !leading-normal md:max-w-full md:text-5xl`;

export const Subtitle = tw(Typography).attrs({
  variant: 'title5',
  align: 'center',
})`max-w-3xl text-base text-neutral-500 md:text-xl`;

export const HeroImageTextWrapper = tw.div`relative mt-2 w-full`;

export const HeroImageText = tw(Typography).attrs({
  variant: 'title4',
  align: 'center',
})`absolute left-1/2 top-0 w-full -translate-x-1/2 text-xl opacity-0 md:text-2xl`;

export const SectionTitle = tw(Typography).attrs({
  variant: 'title2',
  align: 'center',
})`text-2xl md:text-4xl`;

export const SectionSubtitle = tw(Typography).attrs({
  variant: 'title6',
  align: 'center',
})`text-base text-neutral-500 md:max-w-xl md:text-lg lg:max-w-7xl`;

export const BentoGrid = tw.div`mt-8 grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6 xl:gap-8`;

export const BentoCard = tw.div`overflow-hidden rounded-2xl border border-neutral-200/60 bg-gradient-to-br from-white to-neutral-50/30 p-6 shadow-sm backdrop-blur-sm hover:border-neutral-400/80 hover:shadow-xl hover:shadow-neutral-200/20 lg:p-8`;

export const BentoCardContent = tw(Flex).attrs({
  direction: 'column',
})`h-full gap-2 lg:gap-4`;

export const BentoCardTitle = tw(Typography).attrs({
  variant: 'title4',
})`text-xl tracking-normal md:text-2xl`;

export const BentoCardSubtitle = tw(
  Typography,
)`max-h-13 flex-1 pt-cal-sans font-display text-xs tracking-wide text-neutral-500 md:min-h-12 md:text-sm`;

export const BentoCardImage = tw(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`h-full`;
