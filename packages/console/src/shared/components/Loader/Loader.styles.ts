import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { LoaderStyledProps } from './types';

import { loader } from './Loader.cva';

export const Container = tw.div`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform`;

export const Image = tw.img<TwcComponentProps<'img'> & LoaderStyledProps>(
  ({ $size }) => [loader({ size: $size })],
);
