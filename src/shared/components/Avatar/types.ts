import { ImgHTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';

import { $, Component, Styled } from 'theme';

import { avatar } from './Avatar.cva';

type AvatarProps = $<
  {},
  VariantProps<typeof avatar>,
  {
    src: string | null;
    alt: string;
  } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>
>;

export type AvatarComponentProps = Component<AvatarProps>;

export type AvatarStyledProps = Styled<AvatarProps>;
