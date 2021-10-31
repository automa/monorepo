import breakpoints from './breakpoints';
import colors from './colors';
import mediaQueries from './mediaQueries';
import typography from './typography';
import zIndex from './zIndex';

export * from './utils';

const theme = {
  breakpoints,
  colors,
  mediaQueries,
  spacing: (x: number): number => x * 8,
  typography,
  zIndex,
};

export default theme;
