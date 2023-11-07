import { original } from 'immer';
import { StateCreator, create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import CsvProfile, { ProfileSchema, getSchemaHash } from '../models/csvProfile';

type PartialSchemaSettingUpdate = Record<
	string,
	Partial<ProfileSchema[string]>
>;

export interface CsvProfileSliceState {
	profiles: Record<string, CsvProfile>;
	addProfile: (profile: CsvProfile) => void;
	removeProfile: (id: string) => void;
	findProfileByHeaderSchema: (
		schemaFingerprint: string,
	) => CsvProfile | undefined;
	findProfileById: (id: string) => CsvProfile | undefined;
	updateProfileSchema: (id: string, schema: PartialSchemaSettingUpdate) => void;
}

const initializer: StateCreator<
	CsvProfileSliceState,
	[['zustand/persist', unknown], ['zustand/immer', never]]
> = (set, get) => ({
	profiles: {},
	addProfile: (profile) =>
		set((state) => {
			state.profiles[getSchemaHash(Object.keys(profile.schema))] = profile;
		}),
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
	updateProfileSchema: (id, schemaUpdate) => {
		set((state) => {
			const schemaToUpdate = { ...original(state.profiles[id].schema) };

			Object.entries(schemaToUpdate).forEach(([key, settings]) => {
				if (schemaUpdate[key]) {
					const newSettings = schemaUpdate[key];
					schemaToUpdate[key] = {
						...settings,
						...newSettings,
					};
				}
			});

			state.profiles[id].schema = schemaToUpdate;
		});
	},
});

const createCsvProfileStore = persist(immer(initializer), {
	name: 'profiles',
	version: 0,
});

export const useCsvProfileStore = create<CsvProfileSliceState>()(
	createCsvProfileStore,
);
