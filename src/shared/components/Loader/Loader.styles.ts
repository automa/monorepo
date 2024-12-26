import { TwcComponentProps } from 'react-twc';

import { tw } from 'theme';

import { LoaderStyledProps } from './types';

import { loader } from './Loader.cva';

export const Container = tw.div<TwcComponentProps<'div'> & LoaderStyledProps>(
  ({ $size }) => [loader({ size: $size })],
);
