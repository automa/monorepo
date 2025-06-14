import React from 'react';

import {
  useIsExtraLargeOnly,
  useIsExtraSmallOnly,
  useIsLargeOnly,
  useIsMediumOnly,
  useIsScreenSize,
  useIsSmallOnly,
} from 'shared/hooks/useMediaQueries';

import { ScreenSizeHelperProps, ScreenSizeProps } from './types';

export const ExtraSmallOnly: React.FC<ScreenSizeHelperProps> = ({
  children,
}) => {
  const isExtraSmallOnly = useIsExtraSmallOnly();

  return isExtraSmallOnly ? (children as JSX.Element) : null;
};

export const SmallOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isSmallOnly = useIsSmallOnly();

  return isSmallOnly ? (children as JSX.Element) : null;
};

export const MediumOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isMediumOnly = useIsMediumOnly();

  return isMediumOnly ? (children as JSX.Element) : null;
};

export const LargeOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isLargeOnly = useIsLargeOnly();

  return isLargeOnly ? (children as JSX.Element) : null;
};

export const ExtraLargeOnly: React.FC<ScreenSizeHelperProps> = ({
  children,
}) => {
  const isExtraLargeOnly = useIsExtraLargeOnly();

  return isExtraLargeOnly ? (children as JSX.Element) : null;
};

const ScreenSize: React.FC<ScreenSizeProps> = ({ children, ...size }) => {
  const isScreenSize = useIsScreenSize(size);

  return isScreenSize ? (children as JSX.Element) : null;
};

export default ScreenSize;
