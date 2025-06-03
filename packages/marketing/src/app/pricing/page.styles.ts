import { tw } from 'theme';

import { Button, Flex, Typography } from 'components';

export const Container = tw(Flex).attrs({
  direction: 'column',
  alignItems: 'center',
})`py-12 lg:py-16 gap-12 lg:gap-16`;

export const Title = tw(Typography).attrs({
  variant: 'title2',
  align: 'center',
})`text-3xl md:text-4xl`;

export const Subtitle = tw(Typography).attrs({
  variant: 'title6',
  align: 'center',
})`max-w-72 md:max-w-xl text-neutral-500`;

export const PlansContainer = tw(Flex).attrs({
  direction: 'column',
})`max-w-3xl w-full gap-8 lg:flex-row lg:gap-12`;

export const PlanCard = tw(Flex).attrs({
  direction: 'column',
})`flex-1 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm`;

export const PopularBadge = tw.div`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white`;

export const PlanHeader = tw(Flex).attrs({
  direction: 'column',
})`mb-8 gap-4`;

export const PlanName = tw(Typography).attrs({
  variant: 'title4',
})``;

export const PlanDescription = tw(Typography)`text-neutral-600`;

export const PlanPrice = tw(Flex).attrs({
  alignItems: 'baseline',
})`gap-2`;

export const Price = tw(Typography).attrs({
  variant: 'title3',
})``;

export const PriceUnit = tw(Typography).attrs({
  variant: 'small',
})`text-neutral-600`;

export const PriceExtra = tw(Typography).attrs({
  variant: 'small',
})`mt-2 text-neutral-600 leading-relaxed bg-neutral-50 px-3 py-2 rounded-md border border-neutral-200`;

export const FeaturesList = tw.ul`mb-8 flex-1 space-y-3`;

export const FeatureItem = tw(Flex).attrs({
  alignItems: 'center',
})`gap-3`;

export const FeatureText = tw(Typography)`text-neutral-700`;

export const PlanButton = tw(Button).attrs({
  size: 'large',
  fullWidth: true,
})`h-12 text-base lg:text-lg`;

export const Comparison = tw(Flex).attrs({
  direction: 'column',
})`max-w-3xl mt-20 w-full gap-8`;

export const ComparisonTitle = tw(Typography).attrs({
  variant: 'title3',
  align: 'center',
})`mb-8`;

export const ComparisonTable = tw.div`overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm`;

export const TableHeader = tw(Flex)`border-b border-neutral-200 bg-neutral-50`;

export const TableRow = tw(Flex)`border-b border-neutral-100 last:border-b-0`;

export const TableCell = tw(Flex).attrs({
  alignItems: 'center',
  justifyContent: 'center',
})`flex-1 p-4 text-center`;

export const FeatureCell = tw(Flex).attrs({
  alignItems: 'center',
})`flex-[2] p-4`;

export const TableText = tw(Typography).attrs({
  variant: 'small',
})`text-neutral-600`;

export const FAQ = tw(Flex).attrs({
  direction: 'column',
})`mt-20 w-full max-w-3xl gap-8`;

export const FAQTitle = tw(Typography).attrs({
  variant: 'title3',
  align: 'center',
})`mb-8`;

export const FAQItem = tw(Flex).attrs({
  direction: 'column',
})`gap-3`;

export const FAQQuestion = tw(Typography).attrs({
  variant: 'large',
})`font-semibold`;

export const FAQAnswer = tw(Typography)`text-neutral-600`;
