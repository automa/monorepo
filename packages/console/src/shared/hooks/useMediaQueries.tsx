import { useMediaQuery } from 'react-responsive';

import { breakpoints, checkScreenSize, ScreenSize } from 'theme';

export const useIsScreenSize = (size: ScreenSize) => {
  const { min, max } = checkScreenSize(size);

  return useMediaQuery({
    ...(min ? { minWidth: breakpoints[min] } : {}),
    ...(max ? { maxWidth: breakpoints[max] - 1 } : {}),
  });
};

export const useIsExtraSmallOnly = () =>
  useIsScreenSize({
    max: 'sm',
  });

export const useIsSmallOnly = () =>
  useIsScreenSize({
    min: 'sm',
    max: 'md',
  });

export const useIsMediumOnly = () =>
  useIsScreenSize({
    min: 'md',
    max: 'lg',
  });

export const useIsLargeOnly = () =>
  useIsScreenSize({
    min: 'lg',
    max: 'xl',
  });

export const useIsExtraLargeOnly = () =>
  useIsScreenSize({
    min: 'xl',
  });
