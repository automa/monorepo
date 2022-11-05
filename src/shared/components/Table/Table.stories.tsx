import { Meta } from '@storybook/react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

import Table from './Table';
import { TableComponentProps } from './types';

type Data = {
  name: string;
  amount: number;
};

const data: Data[] = [
  { name: 'John', amount: 100 },
  { name: 'Jane', amount: 200 },
];

export default {
  title: 'Table',
  component: Table,
  args: {},
  argTypes: {},
} as Meta<TableComponentProps<Data>>;

export const Default = () => {
  const table = useReactTable({
    data,
    columns: [
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => row.original.name,
      },
      {
        id: 'amount',
        header: 'Amount',
        cell: ({ row }) => row.original.amount,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return <Table table={table} />;
};
