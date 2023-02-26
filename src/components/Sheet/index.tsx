import { ColumnDef, flexRender, getCoreRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { CsvRow } from '~/data/types';

const generateColumnsFromFieldList = (columns: string[]): ColumnDef<CsvRow>[] => {
	return columns.map((col) => ({
		accessorKey: col,
		id: col,
		header: col,
		cell: (info) => info.getValue(),
		// footer: (props) => props.column.id,
	}));
};

interface SheetProps {
	data: CsvRow[];
	columns: string[];
}

const Sheet = ({ data, columns }: SheetProps) => {
	const columns_ = useMemo(() => generateColumnsFromFieldList(columns), [columns]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns: columns_,
		state: {
			// columnOrder,
			columnVisibility,
		},
		onColumnVisibilityChange: setColumnVisibility,
		// onColumnOrderChange: setColumnOrder,
		getCoreRowModel: getCoreRowModel(),
		// debugTable: true,
		// debugHeaders: true,
		// debugColumns: true,
	});

	return (
		<div className="flex overflow-x-scroll w-full ">
			<table className="table-auto">
				<thead>
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id}>
							{hg.headers.map((h) => (
								<th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getCoreRowModel().rows.map((r) => (
						<tr className="even:bg-gray-200" key={r.id}>
							{r.getVisibleCells().map((c) => (
								<td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<aside className="flex-grow">
				{table.getAllLeafColumns().map((col) => (
					<div key={col.id} className="px-1">
						<label>
							<input
								{...{
									type: 'checkbox',
									checked: col.getIsVisible(),
									onChange: col.getToggleVisibilityHandler(),
								}}
							/>
							{col.id}
						</label>
					</div>
				))}
			</aside>
		</div>
	);
};

export default Sheet;
