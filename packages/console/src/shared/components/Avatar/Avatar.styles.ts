import * as Avatar from '@radix-ui/react-avatar';
import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { AvatarStyledProps } from './types';
import { avatar } from './Avatar.cva';

export const Container = tw.div``;

export const Image = tw(Avatar.Image)<
  TwcComponentProps<'img'> & AvatarStyledProps
>(({ $size }) => [avatar({ size: $size }), 'rounded-full']);

export const Fallback = tw(Avatar.Fallback)<
  TwcComponentProps<'span'> & AvatarStyledProps
>(({ $size }) => [
  avatar({ size: $size }),
  'rounded-full flex font-semibold items-center justify-center bg-gray-300 text-gray-800',
]);
