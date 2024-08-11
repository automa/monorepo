import { tw } from 'theme';

import { Flex, Typography } from 'shared';

export const Container = tw.div`relative size-full cursor-pointer rounded-lg bg-white px-6 py-4 shadow-card hover:shadow-cardHover`;

export const Title = tw(Typography)`after:absolute after:inset-0 `;

export const Item = tw(Flex)`relative z-10 w-fit gap-2`;
