import { tw } from 'theme';

export const Container = tw.table``;

export const Header = tw.thead``;

export const HeaderRow = tw.tr``;

export const HeaderCell = tw.th(({ onClick }) => [
  !!onClick && 'cursor-pointer',
]);

export const Body = tw.tbody``;

export const Row = tw.tr(({ onClick }) => [!!onClick && 'cursor-pointer']);

export const Cell = tw.td``;
