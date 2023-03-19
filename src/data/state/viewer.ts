import { v4 } from 'uuid';
import { StateCreator } from 'zustand';
import { FileMeta } from '../models/file';

type TabId = string;
type FileMetaWithId = FileMeta & { fileId: string };

export interface ViewerSlice {
	tabs: Record<TabId, FileMetaWithId | null>;
	activeTabId: TabId;
	createTab: () => void;
	closeTab: (id: TabId) => void;
	setTabFile: (tabId: TabId, fileMeta: FileMetaWithId | null) => void;
}

const initialTabId = v4();

export const viewerSlice: StateCreator<ViewerSlice> = (set) => ({
	tabs: {
		[initialTabId]: null,
	},
	activeTabId: initialTabId,
	createTab: () =>
		set((state) => ({
			...state,
			tabs: {
				...state.tabs,
				[v4()]: null,
			},
		})),
	closeTab: (id) =>
		set((state) => {
			const tabs = { ...state.tabs };
			delete tabs[id];
			return {
				...state,
				tabs,
			};
		}),
	setTabFile: (tabId, fileMeta) =>
		set((state) => {
			return {
				...state,
				tabs: {
					...state.tabs,
					[tabId]: fileMeta,
				},
			};
		}),
});
