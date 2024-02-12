export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

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
