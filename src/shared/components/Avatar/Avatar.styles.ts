import { TwcComponentProps } from 'react-twc';
import * as Avatar from '@radix-ui/react-avatar';

import { tw } from 'theme';

import { AvatarStyledProps } from './types';

import { avatar } from './Avatar.cva';

export const Container = tw.div``;

export const Image = tw(Avatar.Image)<
  TwcComponentProps<typeof Avatar.Image> & AvatarStyledProps
>(({ $variant, $size }) => [avatar({ variant: $variant, size: $size })]);

export const Fallback = tw(Avatar.Fallback)<
  TwcComponentProps<typeof Avatar.Fallback> & AvatarStyledProps
>(({ $variant, $size }) => [
  avatar({ variant: $variant, size: $size }),
  'flex font-semibold items-center justify-center bg-gray-300 text-gray-800',
]);
