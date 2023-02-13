import FontFaceObserver from 'fontfaceobserver';

import breakpoints from './breakpoints';
import buttons from './buttons';
import colors from './colors';
import mediaQueries from './mediaQueries';
import toasts from './toasts';
import typography from './typography';
import zIndex from './zIndex';

export { default as GlobalStyle } from './global';

export * from './mediaQueries';
export * from './utils';

const theme = {
  breakpoints,
  buttons,
  colors,
  mediaQueries,
  spacing: (x: number): number => x * 8,
  toasts,
  typography,
  zIndex,
};

export const loadFonts = async () => {};

export default theme;
