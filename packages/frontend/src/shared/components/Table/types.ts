import { MouseEvent, TableHTMLAttributes } from 'react';
import { Table, Row } from '@tanstack/react-table';

import { $, Component, Styled } from 'theme';

export type TableProps<T> = $<
  {},
  {},
  {
    table: Table<T>;
    onRowClick?: (
      e: MouseEvent<HTMLTableRowElement>,
      row: Row<T>,
    ) => void | Promise<void>;
  } & TableHTMLAttributes<HTMLTableElement>
>;

export type TableComponentProps<T> = Component<TableProps<T>>;

export type TableStyledProps<T> = Styled<TableProps<T>>;
