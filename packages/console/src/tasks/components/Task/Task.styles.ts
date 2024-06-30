import { Link } from 'react-router-dom';

import { tw } from 'theme';

export const Container = tw.div`relative size-full cursor-pointer rounded-lg bg-white px-6 py-4 shadow-card hover:shadow-cardHover`;

export const Title = tw(Link)`after:absolute after:inset-0`;
