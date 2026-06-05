import { FC, ReactElement } from 'react';

import {
  useIsExtraLargeOnly,
  useIsExtraSmallOnly,
  useIsLargeOnly,
  useIsMediumOnly,
  useIsScreenSize,
  useIsSmallOnly,
} from 'shared/hooks/useMediaQueries';

import { ScreenSizeHelperProps, ScreenSizeProps } from './types';

export const ExtraSmallOnly: FC<ScreenSizeHelperProps> = ({ children }) => {
  const isExtraSmallOnly = useIsExtraSmallOnly();

  return isExtraSmallOnly ? (children as ReactElement) : null;
};

export const SmallOnly: FC<ScreenSizeHelperProps> = ({ children }) => {
  const isSmallOnly = useIsSmallOnly();

  return isSmallOnly ? (children as ReactElement) : null;
};

export const MediumOnly: FC<ScreenSizeHelperProps> = ({ children }) => {
  const isMediumOnly = useIsMediumOnly();

  return isMediumOnly ? (children as ReactElement) : null;
};

export const LargeOnly: FC<ScreenSizeHelperProps> = ({ children }) => {
  const isLargeOnly = useIsLargeOnly();

  return isLargeOnly ? (children as ReactElement) : null;
};

export const ExtraLargeOnly: FC<ScreenSizeHelperProps> = ({ children }) => {
  const isExtraLargeOnly = useIsExtraLargeOnly();

  return isExtraLargeOnly ? (children as ReactElement) : null;
};

const ScreenSize: FC<ScreenSizeProps> = ({ children, ...size }) => {
  const isScreenSize = useIsScreenSize(size);

  return isScreenSize ? (children as ReactElement) : null;
};

export default ScreenSize;
