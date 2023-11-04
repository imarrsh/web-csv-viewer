import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CsvProfile, { getSchemaHash } from '../models/csvProfile';
import { createSelectors } from './store';

export interface CsvProfileSliceState {
	profiles: Record<string, CsvProfile>;
	addProfile: (profile: CsvProfile, id?: string) => void;
	removeProfile: (id: string) => void;
	findProfileByHeaderSchema: (
		schemaFingerprint: string,
	) => CsvProfile | undefined;
	findProfileById: (id: string) => CsvProfile | undefined;
}

export const useCsvProfileStore = create<CsvProfileSliceState>()(
	persist(
		(set, get) => ({
			profiles: {},
			addProfile: (profile, id) =>
				set((state) => ({
					...state,
					profiles: {
						...state.profiles,
						[id ? id : getSchemaHash(Object.keys(profile.schema))]: profile,
					},
				})),
			removeProfile: (id) =>
				set((state) => {
					const profiles = { ...state.profiles };
					delete profiles[id];
					return {
						...state,
						profiles,
					};
				}),
			findProfileByHeaderSchema: (schemaFingerprint: string) => {
				return Object.values(get().profiles).find((profileEntry) => {
					const { schema } = profileEntry;
					const fingerprint = getSchemaHash(Object.keys(schema));
					return fingerprint === schemaFingerprint;
				});
			},
			findProfileById: (id: string) => {
				return get().profiles[id];
			},
		}),
		{
			name: 'profiles',
			version: 0,
		},
	),
);

export const profileStore = createSelectors(useCsvProfileStore);
