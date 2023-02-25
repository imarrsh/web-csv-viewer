import {
  Column,
  ColumnDef,
  ColumnOrderState,
  flexRender,
  getCoreRowModel,
  Header,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { CsvRow } from "~/data/types";

const generateColumnsFromCSV = (data: CsvRow[]): ColumnDef<CsvRow>[] => {
  return data.map((row) => ({
    accessorKey: "firstName",
    id: "firstName",
    header: "First Name",
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }));
};

interface SheetProps {
  data: CsvRow[];
}

const Sheet = ({ data }: SheetProps) => {
  const columns = useMemo(() => generateColumnsFromCSV(data), [data]);

  const table = useReactTable({
    data,
    columns,
    // state: {
    //   columnOrder,
    // },
    // onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id}>
                {flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getCoreRowModel().rows.map(r => (
          <tr key={r.id}>
            {r.getVisibleCells().map(c => (
              <td key={c.id}>
                {flexRender(c.column.columnDef.cell, c.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Sheet;
