import { v4 } from 'uuid';
import { StateCreator } from 'zustand';
import { CsvColumn, CsvFile } from '../models/csv';

interface WorkingFilesState {
	files: Record<string, CsvFile>;
}

interface WorkingFilesActions {
	setFile: (file: CsvFile, id?: string) => void;
	removeFile: (id: string) => void;
	setColumnVisibility: (
		fileId: string,
		column: string,
		visible: boolean,
	) => void;
	setColumnOrder: (fileId: string, columnOrderState: string[]) => void;
}

export type WorkingFilesSlice = WorkingFilesState & WorkingFilesActions;

export const workingFilesSlice: StateCreator<
	WorkingFilesSlice,
	[['zustand/immer', never]]
> = (set) => ({
	files: {},
	setFile: (file, id) =>
		set((state) => {
			state.files[id ? id : v4()] = file;
		}),
	removeFile: (id) =>
		set((state) => {
			delete state.files[id];
		}),
	setColumnVisibility: (fileId, column, visible) =>
		set((state) => {
			const file = state.files[fileId];
			if (file) {
				const col = file.columns.find((c) => c.name === column);
				if (col) {
					col.visible = visible;
				}
			}
		}),
	setColumnOrder: (fileId, columnOrderState) =>
		set((state) => {
			const file = state.files[fileId];
			if (file) {
				const newColumnOrder = columnOrderState.reduce(
					(cols, colName, index) => {
						let found = file.columns.find((c) => c.name === colName);
						if (found) {
							found = { ...found, ordinal: index };
							cols.push(found);
						}
						return cols;
					},
					[] as CsvColumn[],
				);

				file.columns = newColumnOrder;
			}
		}),
});
