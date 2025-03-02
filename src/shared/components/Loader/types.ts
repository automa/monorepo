import { HTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { loader } from './Loader.cva';

type LoaderProps = $<
  {},
  VariantProps<typeof loader>,
  HTMLAttributes<HTMLDivElement>
>;

export type LoaderComponentProps = Component<LoaderProps>;

export type LoaderStyledProps = Styled<LoaderProps>;
