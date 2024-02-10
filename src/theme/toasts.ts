import { css } from 'styled-components';

const toasts = {
  info: {
    root: () => css``,
    title: () => css``,
    description: () => css``,
    action: () => css``,
    close: () => css``,
  },
  error: {
    root: () => css``,
    title: () => css``,
    description: () => css``,
    action: () => css``,
    close: () => css``,
  },
  success: {
    root: () => css``,
    title: () => css``,
    description: () => css``,
    action: () => css``,
    close: () => css``,
  },
} as const;

export default toasts;
