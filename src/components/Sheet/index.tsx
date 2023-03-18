import { Popover } from '@headlessui/react';
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
import Icon from '~/components/Icon';
import { CsvRow } from '~/data/models/file';

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
			<div className="flex gap-2 p-2 whitespace-nowrap" ref={previewRef}>
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
	onDownload?: (data: CsvRow[], fileName?: string) => void;
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

		onDownload?.(visibleData, title);
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="flex items-center">
				<button
					className="flex gap-2 border items-center border-gray-500 rounded-md text-gray-700 py-2 px-3"
					type="button"
					onClick={onClear}
				>
					<Icon className="text-gray-500" name="TrashIcon" variant="solid" /> Clear
				</button>
				<div className="flex-grow" />
				{title && <h2 className="text-center text-gray-400">{title}</h2>}
				<div className="flex-grow" />
				<button
					className="flex gap-2 border items-center bg-green-300 rounded-md text-green-700 py-2 px-3"
					onClick={prepareDownload}
				>
					<Icon className="text-green-700" name="ArrowDownTrayIcon" variant="solid" /> Download
				</button>
				<Popover className="relative">
					<Popover.Button className="flex gap-2 items-center py-2 px-3 bg-slate-400 rounded-md">
						<Icon className="text-gray-700" name="Cog6ToothIcon" variant="solid" />
					</Popover.Button>

					<Popover.Panel className="absolute right-0 top-10 z-10 bg-white p-2 rounded-md shadow-lg">
						<h3 className="text-lg font-bold px-4">Columns</h3>
						{table.getAllLeafColumns().map((col) => (
							<label
								key={col.id}
								className="flex gap-2 py-2 px-3 hover:bg-gray-200 items-center whitespace-nowrap rounded"
							>
								<input type="checkbox" checked={col.getIsVisible()} onChange={col.getToggleVisibilityHandler()} />
								{col.id}
							</label>
						))}
					</Popover.Panel>
				</Popover>
				<button></button>
			</div>
			<div className="flex w-full">
				<div className="overflow-x-scroll">
					<table className="table-auto">
						<thead>
							{table.getHeaderGroups().map((hg) => (
								<tr className="before:[content:'_']" key={hg.id}>
									{hg.headers.map((h) => (
										<DraggableColumnHeader key={h.id} header={h} table={table} />
									))}
								</tr>
							))}
						</thead>
						<tbody className="[counter-reset:row-number]">
							{table.getCoreRowModel().rows.map((r, i) => (
								<tr className="even:bg-gray-200" key={r.id}>
									<td className="px-2 text-gray-500 select-none">
										<small className="select-none">{i + 1}</small>
									</td>
									{r.getVisibleCells().map((c) => (
										<td className="p-2 whitespace-nowrap max-w-md text-ellipsis truncate" key={c.id}>
											{flexRender(c.column.columnDef.cell, c.getContext())}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</DndProvider>
	);
};

export default Sheet;
