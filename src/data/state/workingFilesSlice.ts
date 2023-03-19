import { v4 } from 'uuid';
import { StateCreator } from 'zustand';
import { CsvFile } from '../models/file';

export interface WorkFilesSlice {
	files: Record<string, CsvFile>;
	setFile: (file: CsvFile, id?: string) => void;
	removeFile: (id: string) => void;
}

export const workingFilesSlice: StateCreator<WorkFilesSlice> = (set) => ({
	files: {},
	setFile: (file: CsvFile, id?: string) =>
		set((state) => ({
			...state,
			files: {
				...state.files,
				[id ? id : v4()]: file,
			},
		})),
	removeFile: (id: string) =>
		set((state) => {
			const files = { ...state.files };
			delete files[id];
			return {
				...state,
				files,
			};
		}),
});
