import React from 'react';
import { flexRender } from '@tanstack/react-table';

import { TableComponentProps } from './types';

import {
  Body,
  Cell,
  Container,
  Header,
  HeaderCell,
  HeaderRow,
  Row,
} from './Table.styles';

const Table = <T,>({ table, onRowClick, ...props }: TableComponentProps<T>) => {
  return (
    <Container {...props}>
      <Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <HeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <HeaderCell
                key={header.id}
                colSpan={header.colSpan}
                onClick={
                  header.column.getCanSort()
                    ? header.column.getToggleSortingHandler()
                    : undefined
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                {header.column.getIsSorted()}
              </HeaderCell>
            ))}
          </HeaderRow>
        ))}
      </Header>
      <Body>
        {table.getRowModel().rows.map((row) => (
          <Row key={row.id} onClick={onRowClick && ((e) => onRowClick(e, row))}>
            {row.getVisibleCells().map((cell) => (
              <Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Cell>
            ))}
          </Row>
        ))}
      </Body>
    </Container>
  );
};

export default Table;
