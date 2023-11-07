import {
	Column,
	ColumnDef,
	ColumnOrderState,
	flexRender,
	getCoreRowModel,
	Header,
	Table,
	Updater,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CsvColumn, CsvField, CsvFile, CsvRow } from '~/data/models/csv';
import { tw } from '~/lib/utils/alias';
import Icon from '../Icon';

const generateColumnsFromFieldList = (
	columns: CsvColumn[],
): ColumnDef<CsvRow>[] => {
	return columns.map((col) => {
		return {
			// use accessorFn since column headers can contain unscrupulous characters (dots, aka property accessors)
			accessorFn: (data) => data[col.name],
			id: col.name,
			header: col.name,
			cell: (info) => {
				return (info.getValue() as CsvField)?.value;
			},
		};
	});
};

const reorderColumn = (
	draggedColumnId: string,
	targetColumnId: string,
	columnOrder: string[],
): ColumnOrderState => {
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

const DraggableColumnHeader = ({
	header,
	table,
}: DraggableColumnHeaderProps) => {
	const { getState, setColumnOrder } = table;
	const { columnOrder } = getState();
	const { column } = header;
	const [grabbing, setGrabbing] = useState(false);

	const [, dropRef] = useDrop({
		accept: 'column',
		drop: (draggedColumn: Column<CsvRow>) => {
			const newColumnOrder = reorderColumn(
				draggedColumn.id,
				column.id,
				columnOrder,
			);
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
		<th
			ref={dropRef}
			colSpan={header.colSpan}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<div
				className="flex gap-2 items-center p-2 whitespace-nowrap"
				ref={previewRef}
			>
				{header.isPlaceholder
					? null
					: flexRender(header.column.columnDef.header, header.getContext())}
				<button
					type="button"
					className={tw(
						'flex',
						grabbing || isDragging ? 'cursor-grabbing' : 'cursor-grab',
					)}
					onMouseDown={() => setGrabbing(true)}
					onMouseUp={() => setGrabbing(false)}
					ref={dragRef}
				>
					<Icon name="Bars2Icon" variant="solid" />
				</button>
			</div>
		</th>
	);
};

interface SheetProps {
	className?: string;
	// columns: string[];
	data: CsvFile;
	onColumnOrderChange?: (state: string[]) => void;
}

const Sheet = ({
	className,
	data: { data = [], columns = [] },
	onColumnOrderChange,
}: SheetProps) => {
	const columns_ = useMemo(
		() => generateColumnsFromFieldList(columns),
		[columns],
	);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

	const visibleCols = useMemo(
		() =>
			columns.reduce((acc, c) => {
				return { ...acc, [c.name]: c.visible };
			}, {} as VisibilityState),
		[columns],
	);

	useEffect(() => {
		setColumnVisibility(visibleCols);
	}, [visibleCols]);

	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
		columns
			.toSorted((colA, colB) => {
				const result = colA.ordinal - colB.ordinal;
				return result;
			})
			.map((col) => col.name), //must start out with populated columnOrder so we can splice
	);

	const handleColumnOrderChange = (state: Updater<ColumnOrderState>) => {
		setColumnOrder(state);
		// updater isn't a func here, just the array of columns
		onColumnOrderChange?.(state as string[]);
	};

	const table = useReactTable({
		data,
		columns: columns_,
		state: {
			columnOrder,
			columnVisibility,
		},
		onColumnOrderChange: handleColumnOrderChange,
		getCoreRowModel: getCoreRowModel(),
		// debugTable: true,
		// debugHeaders: true,
		// debugColumns: true,
	});

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="flex w-full">
				<div className="overflow-x-scroll">
					<table className="table-auto">
						<thead>
							{table.getHeaderGroups().map((hg) => (
								<tr className="before:[content:'_']" key={hg.id}>
									{hg.headers.map((h) => (
										<DraggableColumnHeader
											key={h.id}
											header={h}
											table={table}
										/>
									))}
								</tr>
							))}
						</thead>
						<tbody className="[counter-reset:row-number]">
							{table.getCoreRowModel().rows.map((r, i) => (
								<tr
									className="even:bg-gray-200 dark:even:bg-slate-700"
									key={r.id}
								>
									<td className="px-2 text-gray-500 select-none">
										<small className="select-none">{i + 1}</small>
									</td>
									{r.getVisibleCells().map((c) => (
										<td
											className="p-2 whitespace-nowrap max-w-md text-ellipsis truncate"
											key={c.id}
										>
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
