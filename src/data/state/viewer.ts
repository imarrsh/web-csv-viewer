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
	linkFile: (tabId: TabId, fileMeta: FileMetaWithId) => void;
}

const initialTabId = v4();

export const viewerSlice: StateCreator<ViewerSlice> = (set) => ({
	tabs: {
		[initialTabId]: null,
	},
	activeTabId: initialTabId,
	createTab: () =>
		set((state) => ({
			tabs: {
				...state.tabs,
				[v4()]: null,
			},
		})),
	closeTab: (id) =>
		set((state) => {
			const tabs = { ...state.tabs };
			delete tabs[id];
			return tabs;
		}),
	linkFile: (tabId, fileMeta) =>
		set((state) => {
			console.log({ state, tabId, fileMeta });
			return {
				tabs: {
					...state.tabs,
					[tabId]: fileMeta,
				},
			};
		}),
});
