import 'twin.macro';

import theme from 'theme';

type ThemeType = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}

declare module 'react' {
  interface Attributes {
    tw?: string;
  }
}
