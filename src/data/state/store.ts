import { create, StoreApi, UseBoundStore } from 'zustand';
import { csvProfileSlice, CsvProfileSliceState } from './csvProfileSlice';
import { ViewerSlice, viewerSlice } from './viewer';
import { WorkFilesSlice, workingFilesSlice } from './workingFilesSlice';

type CombinedStore = CsvProfileSliceState & WorkFilesSlice & ViewerSlice;

type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
	const store = _store as WithSelectors<typeof _store>;
	store.use = {};
	for (const k of Object.keys(store.getState())) {
		(store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
	}

	return store;
};

export const useBoundStore = create<CombinedStore>()((...a) => ({
	...csvProfileSlice(...a),
	...workingFilesSlice(...a),
	...viewerSlice(...a),
}));
