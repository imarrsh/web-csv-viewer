import { create, StoreApi, UseBoundStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { viewerSlice, ViewerSliceState } from './viewer';
import { workingFilesSlice, WorkingFilesSlice } from './workingFilesSlice';

type CombinedStore = WorkingFilesSlice & ViewerSliceState;

type WithSelectors<S> = S extends { getState: () => infer T }
	? S & { use: { [K in keyof T]: () => T[K] } }
	: never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
	_store: S,
) => {
	const store = _store as WithSelectors<typeof _store>;
	store.use = {};
	for (const k of Object.keys(store.getState())) {
		(store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
	}

	return store;
};

/**
 * Combines the {@link viewerSlice} and {@link workingFilesSlice}
 */
export const useBoundStore = create<CombinedStore>()(
	immer((...a) => ({
		...viewerSlice(...a),
		...workingFilesSlice(...a),
	})),
);
