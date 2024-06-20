import { MouseEvent, TableHTMLAttributes } from 'react';
import { Row, Table } from '@tanstack/react-table';

import { $, Component, Styled } from 'theme';

type TableProps<T> = $<
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
