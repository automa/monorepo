import { css } from 'styled-components/macro';

const toasts = {
  info: {
    root: () => css`
      background-color: ${({ theme }) => theme.colors.black};
      color: ${({ theme }) => theme.colors.white};
    `,
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
