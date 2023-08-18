import styled, { css } from 'styled-components/macro';

export const Container = styled.table``;

export const Header = styled.thead``;

export const HeaderRow = styled.tr``;

export const HeaderCell = styled.th`
  ${({ onClick }) =>
    !!onClick &&
    css`
      cursor: pointer;
    `}
`;

export const Body = styled.tbody``;

export const Row = styled.tr`
  ${({ onClick }) =>
    !!onClick &&
    css`
      cursor: pointer;
    `}
`;

export const Cell = styled.td``;
