import * as Avatar from '@radix-ui/react-avatar';
import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { AvatarStyledProps } from './types';
import { avatar } from './Avatar.cva';

export const Container = tw.div``;

export const Image = tw(Avatar.Image)<
  TwcComponentProps<typeof Avatar.Image> & AvatarStyledProps
>(({ $size }) => [avatar({ size: $size }), 'rounded-full']);

export const Fallback = tw(Avatar.Fallback)<
  TwcComponentProps<typeof Avatar.Fallback> & AvatarStyledProps
>(({ $size }) => [
  avatar({ size: $size }),
  'rounded-full flex font-semibold items-center justify-center bg-neutral-300 text-neutral-800',
]);
