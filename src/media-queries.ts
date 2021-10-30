import React from 'react';
import { useMediaQuery } from 'react-responsive';

import theme from 'theme';

export const useIsMobileOnly = () =>
  useMediaQuery({
    maxWidth: theme.breakpoints.mobile,
  });

export const useIsTabletOnly = () =>
  useMediaQuery({
    minWidth: theme.breakpoints.mobile + 1,
    maxWidth: theme.breakpoints.tablet,
  });

export const useIsDesktopOnly = () =>
  useMediaQuery({
    minWidth: theme.breakpoints.tablet + 1,
    maxWidth: theme.breakpoints.desktop,
  });

export const useIsWideOnly = () =>
  useMediaQuery({
    minWidth: theme.breakpoints.desktop + 1,
    maxWidth: theme.breakpoints.wide,
  });

export const useIsExtraWideOnly = () =>
  useMediaQuery({
    minWidth: theme.breakpoints.wide + 1,
  });

export const useIsTabletOrMobile = () =>
  useMediaQuery({
    maxWidth: theme.breakpoints.tablet,
  });

export const useIsDesktopOrWide = () =>
  useMediaQuery({
    minWidth: theme.breakpoints.tablet + 1,
  });

export const MobileOnly: React.FC<{}> = ({ children }) => {
  const isMobileOnly = useIsMobileOnly();

  return isMobileOnly ? (children as JSX.Element) : null;
};

export const TabletOnly: React.FC<{}> = ({ children }) => {
  const isTabletOnly = useIsTabletOnly();

  return isTabletOnly ? (children as JSX.Element) : null;
};

export const DesktopOnly: React.FC<{}> = ({ children }) => {
  const isDesktopOnly = useIsDesktopOnly();

  return isDesktopOnly ? (children as JSX.Element) : null;
};

export const WideOnly: React.FC<{}> = ({ children }) => {
  const isWideOnly = useIsWideOnly();

  return isWideOnly ? (children as JSX.Element) : null;
};

export const ExtraWideOnly: React.FC<{}> = ({ children }) => {
  const isExtraWideOnly = useIsExtraWideOnly();

  return isExtraWideOnly ? (children as JSX.Element) : null;
};

export const TabletOrMobile: React.FC<{}> = ({ children }) => {
  const isTabletOrMobile = useIsTabletOrMobile();

  return isTabletOrMobile ? (children as JSX.Element) : null;
};

export const DesktopOrWide: React.FC<{}> = ({ children }) => {
  const isDesktopOrWide = useIsDesktopOrWide();

  return isDesktopOrWide ? (children as JSX.Element) : null;
};
