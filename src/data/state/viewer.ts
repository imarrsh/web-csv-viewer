import { v4 } from 'uuid';
import { StateCreator } from 'zustand';
import { FileMeta } from '../models/file';

type TabId = string;
type FileMetaWithId = FileMeta & { fileId: string };

export interface ViewerSliceState {
	tabs: Record<TabId, FileMetaWithId | null>;
	activeTabId: TabId;
	setActiveTab: (id: string) => void;
	createTab: () => string;
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
	setActiveTab: (id: string) =>
		set((state) => {
			state.activeTabId = id;
		}),
	createTab: () => {
		const tabId = v4();
		set((state) => {
			state.tabs[tabId] = null;
		});
		return tabId;
	},
	closeTab: (id) =>
		set((state) => {
			delete state.tabs[id];
		}),
	setTabFile: (tabId, fileMeta) =>
		set((state) => {
			state.tabs[tabId] = fileMeta;
		}),
});
