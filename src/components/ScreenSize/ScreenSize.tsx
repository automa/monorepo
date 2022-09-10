import React from 'react';

import {
  useIsScreenSize,
  useIsMobileOnly,
  useIsTabletOnly,
  useIsLaptopOnly,
  useIsDesktopOnly,
  useIsWideOnly,
  useIsExtraWideOnly,
} from 'hooks';

import { ScreenSizeHelperProps, ScreenSizeProps } from './types';

export const MobileOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isMobileOnly = useIsMobileOnly();

  return isMobileOnly ? (children as JSX.Element) : null;
};

export const TabletOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isTabletOnly = useIsTabletOnly();

  return isTabletOnly ? (children as JSX.Element) : null;
};

export const LaptopOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isLaptopOnly = useIsLaptopOnly();

  return isLaptopOnly ? (children as JSX.Element) : null;
};

export const DesktopOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isDesktopOnly = useIsDesktopOnly();

  return isDesktopOnly ? (children as JSX.Element) : null;
};

export const WideOnly: React.FC<ScreenSizeHelperProps> = ({ children }) => {
  const isWideOnly = useIsWideOnly();

  return isWideOnly ? (children as JSX.Element) : null;
};

export const ExtraWideOnly: React.FC<ScreenSizeHelperProps> = ({
  children,
}) => {
  const isExtraWideOnly = useIsExtraWideOnly();

  return isExtraWideOnly ? (children as JSX.Element) : null;
};

const ScreenSize: React.FC<ScreenSizeProps> = ({ children, ...size }) => {
  const isScreenSize = useIsScreenSize(size);

  return isScreenSize ? (children as JSX.Element) : null;
};

export default ScreenSize;
