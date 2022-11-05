import React from 'react';
import { flexRender } from '@tanstack/react-table';

import { TableComponentProps } from './types';

import {
  Container,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
  Footer,
  FooterRow,
  FooterCell,
} from './Table.styles';

const Table = <T,>({ table, onRowClick, ...props }: TableComponentProps<T>) => {
  return (
    <Container {...props}>
      <Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <HeaderRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <HeaderCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
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
      <Footer>
        {table.getFooterGroups().map((footerGroup) => (
          <FooterRow key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <FooterCell key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext(),
                    )}
              </FooterCell>
            ))}
          </FooterRow>
        ))}
      </Footer>
    </Container>
  );
};

export default Table;
