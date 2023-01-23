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
