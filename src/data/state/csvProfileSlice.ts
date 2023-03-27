import { v4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CsvProfile from '../models/csvProfile';
import { createSelectors } from './store';

export function createSchemaFingerprint(columns: string[]) {
	return columns.join('+');
}

export interface CsvProfileSliceState {
	profiles: Record<string, CsvProfile>;
	setProfile: (profile: CsvProfile, id?: string) => void;
	removeProfile: (id: string) => void;
}

export const useCsvProfileStore = create<CsvProfileSliceState>()(
	persist(
		(set, get) => ({
			profiles: {},
			setProfile: (profile, id) =>
				set((state) => ({
					...state,
					profiles: {
						...state.profiles,
						[id ? id : v4()]: profile,
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
				return Object.entries(get().profiles).find((profileEntry) => {
					const [, profileData] = profileEntry;
					const { schema } = profileData;
					const fingerprint = createSchemaFingerprint(Object.keys(schema));
					return fingerprint === schemaFingerprint;
				});
			},
		}),
		{
			name: 'profiles',
			version: 0,
		},
	),
);

export const profileStore = createSelectors(useCsvProfileStore);
