import colors from './colors';
import zIndex from './zIndex';

const theme = {
  colors,
  spacing: (x: number): number => x * 8,
  zIndex,
};

export default theme;
