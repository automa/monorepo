import { Link } from 'react-router-dom';

import { tw } from 'theme';

import { Badge, Typography } from 'shared';

export const Container = tw.div`relative size-full cursor-pointer rounded-lg bg-white px-6 py-4 shadow-card hover:shadow-cardHover`;

export const Title = tw(Link)`after:absolute after:inset-0`;

export const Item = tw(Badge)`py-3 gap-2`;

export const ItemText = tw(Typography).attrs({
  variant: 'xsmall',
})`relative z-10 min-w-2 text-center`;
