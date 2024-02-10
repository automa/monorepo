import { css } from 'styled-components';

const buttons = {
  variants: {
    primary: () => css``,
    secondary: () => css``,
    tertiary: () => css``,
  },
  sizes: {
    small: () => css``,
    medium: () => css``,
    large: () => css``,
  },
} as const;

export default buttons;
