import { useMediaQuery } from 'react-responsive';
import { useTheme } from 'styled-components';

import { checkScreenSize, ScreenSize } from 'theme';

export const useIsScreenSize = (size: ScreenSize) => {
  const theme = useTheme();
  const { min, max } = checkScreenSize(size);

  return useMediaQuery({
    ...(min ? { minWidth: theme.breakpoints[min] + 1 } : {}),
    ...(max ? { maxWidth: theme.breakpoints[max] } : {}),
  });
};

export const useIsMobileOnly = () =>
  useIsScreenSize({
    max: 'mobile',
  });

export const useIsTabletOnly = () =>
  useIsScreenSize({
    min: 'mobile',
    max: 'tablet',
  });

export const useIsLaptopOnly = () =>
  useIsScreenSize({
    min: 'tablet',
    max: 'laptop',
  });

export const useIsDesktopOnly = () =>
  useIsScreenSize({
    min: 'laptop',
    max: 'desktop',
  });

export const useIsWideOnly = () =>
  useIsScreenSize({
    min: 'desktop',
    max: 'wide',
  });

export const useIsExtraWideOnly = () =>
  useIsScreenSize({
    min: 'wide',
  });
