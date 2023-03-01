import {
	Column,
	ColumnDef,
	ColumnOrderState,
	flexRender,
	getCoreRowModel,
	Header,
	Table,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
	columnOrder.splice(
		columnOrder.indexOf(targetColumnId),
		0,
		columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string,
	);
	return [...columnOrder];
};

interface DraggableColumnHeaderProps {
	header: Header<CsvRow, unknown>;
	table: Table<CsvRow>;
}

const DraggableColumnHeader = ({ header, table }: DraggableColumnHeaderProps) => {
	const { getState, setColumnOrder } = table;
	const { columnOrder } = getState();
	const { column } = header;

	const [, dropRef] = useDrop({
		accept: 'column',
		drop: (draggedColumn: Column<CsvRow>) => {
			console.log(`drop`);
			const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder);
			setColumnOrder(newColumnOrder);
		},
	});

	const [{ isDragging }, dragRef, previewRef] = useDrag({
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: () => column,
		type: 'column',
	});

	return (
		<th ref={dropRef} colSpan={header.colSpan} style={{ opacity: isDragging ? 0.5 : 1 }}>
			<div className="flex gap-2" ref={previewRef}>
				{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
				<button ref={dragRef}>🟰</button>
			</div>
		</th>
	);
};

interface SheetProps {
	data: CsvRow[];
	columns: string[];
	title?: string;
	onClear?: () => void;
	onDownload?: (data: CsvRow[]) => void;
}

const Sheet = ({ data, columns, title, onClear, onDownload }: SheetProps) => {
	const columns_ = useMemo(() => generateColumnsFromFieldList(columns), [columns]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
		columns.map((column) => column as string), //must start out with populated columnOrder so we can splice
	);

	const table = useReactTable({
		data,
		columns: columns_,
		state: {
			columnOrder,
			columnVisibility,
		},
		onColumnVisibilityChange: setColumnVisibility,
		onColumnOrderChange: setColumnOrder,
		getCoreRowModel: getCoreRowModel(),
		// debugTable: true,
		// debugHeaders: true,
		// debugColumns: true,
	});

	const prepareDownload = () => {
		const visibleColumns = table.getAllLeafColumns().filter((col) => col.getIsVisible());
		const visibleData = table.getCoreRowModel().rows.reduce((rows, row) => {
			const visibleCells = row.getAllCells().filter((cell) => visibleColumns.includes(cell.column));

			const visibleDataForRow = visibleCells.reduce((newRow, cell) => {
				return {
					...newRow,
					[cell.column.id]: cell.getValue(),
				};
			}, {} as CsvRow);

			rows.push(visibleDataForRow);

			return rows;
		}, [] as CsvRow[]);

		onDownload?.(visibleData);
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="flex items-center">
				<button className="border bg-gray-300 rounded-md text-gray-700 py-2 px-3" type="button" onClick={onClear}>
					🗑️ Clear
				</button>
				<div className="flex-grow" />
				{title && <h2 className="text-center text-gray-400">{title}</h2>}
				<div className="flex-grow" />
				<button className="border bg-green-300 rounded-md text-green-700 py-2 px-3" onClick={prepareDownload}>
					⬇ Download
				</button>
			</div>
			<div className="flex overflow-x-scroll w-full">
				<table className="table-auto">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((h) => (
									<DraggableColumnHeader key={h.id} header={h} table={table} />
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
		</DndProvider>
	);
};

export default Sheet;
