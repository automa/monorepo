import { Meta } from '@storybook/react';
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import Table from './Table';
import { TableComponentProps } from './types';

type Data = {
  name: string;
  amount: number;
};

const data: Data[] = [
  { name: 'Jenny', amount: 400 },
  { name: 'John', amount: 100 },
  { name: 'Jill', amount: 500 },
  { name: 'Jane', amount: 300 },
  { name: 'June', amount: 200 },
];

export default {
  title: 'Table',
  component: Table,
  args: {},
  argTypes: {
    onRowClick: {
      action: true,
    },
  },
} as Meta<TableComponentProps<Data>>;

export const Default = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: [
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => row.original.name,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => row.original.amount,
      },
    ],
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return <Table table={table} />;
};
