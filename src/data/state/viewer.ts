import { v4 } from 'uuid';
import { StateCreator } from 'zustand';
import { FileMeta } from '../models/file';

type TabId = string;
type FileMetaWithId = FileMeta & { fileId: string };

export interface ViewerSliceState {
	tabs: Record<TabId, FileMetaWithId | null>;
	activeTabId: TabId;
	createTab: () => void;
	closeTab: (id: TabId) => void;
	setTabFile: (tabId: TabId, fileMeta: FileMetaWithId | null) => void;
}

const initialTabId = v4();

export const viewerSlice: StateCreator<
	ViewerSliceState,
	[['zustand/immer', never]]
> = (set) => ({
	tabs: {
		[initialTabId]: null,
	},
	activeTabId: initialTabId,
	createTab: () =>
		set((state) => {
			state.tabs[v4()] = null;
		}),
	closeTab: (id) =>
		set((state) => {
			delete state.tabs[id];
		}),
	setTabFile: (tabId, fileMeta) =>
		set((state) => {
			state.tabs[tabId] = fileMeta;
		}),
});
