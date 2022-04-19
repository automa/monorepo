import {
  css,
  CSSObject,
  Interpolation,
  InterpolationFunction,
  ThemedStyledProps,
  DefaultTheme,
} from 'styled-components/macro';

import breakpoints from './breakpoints';

type Breakpoint = keyof typeof breakpoints;

export type ScreenSize =
  | {
      min: Breakpoint;
      max: Breakpoint;
    }
  | {
      min: Breakpoint;
      max?: never;
    }
  | {
      min?: never;
      max: Breakpoint;
    };

export const checkScreenSize = ({ min, max }: ScreenSize) => {
  // If both props are given
  if (min && max) {
    // Error if they are equal
    if (min === max) {
      throw new Error('Same value is given for both min and max breakpoints');
    }

    // Swap if the smaller one is bigger
    if (breakpoints[min] > breakpoints[max]) {
      return { min: max, max: min };
    }
  }

  return { min, max };
};

const screenSize = (size: ScreenSize) => {
  const { min, max } = checkScreenSize(size);

  const conditions: string[] = [];

  if (min) {
    conditions.push(`min-width: ${breakpoints[min] + 1}px`);
  }

  if (max) {
    conditions.push(`max-width: ${breakpoints[max]}px`);
  }

  return <P extends object>(
    first:
      | TemplateStringsArray
      | CSSObject
      | InterpolationFunction<ThemedStyledProps<P, DefaultTheme>>,
    ...interpolations: Array<Interpolation<ThemedStyledProps<P, DefaultTheme>>>
  ) => css`
    @media (${conditions.join(' and ')}) {
      ${css(first, ...interpolations)}
    }
  `;
};

const mediaQueries = {
  screenSize,
  mobileOnly: screenSize({ max: 'mobile' }),
  tabletOnly: screenSize({ min: 'mobile', max: 'tablet' }),
  laptopOnly: screenSize({ min: 'tablet', max: 'laptop' }),
  desktopOnly: screenSize({ min: 'laptop', max: 'desktop' }),
  wideOnly: screenSize({ min: 'desktop', max: 'wide' }),
  extraWideOnly: screenSize({ min: 'wide' }),
} as const;

export default mediaQueries;
