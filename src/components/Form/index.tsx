import { ParseResult } from 'papaparse';
import { FormEvent, useState } from 'react';
import { CsvRowRaw } from '~/data/models/csv';
import { getSchemaHash } from '~/data/models/csvProfile';
import { FileMeta } from '~/data/models/file';
import { useCsvProfileStore } from '~/data/state/csvProfileSlice';
import CsvInput from './CsvInput';

export interface SubmitData {
	csv: {
		data: CsvRowRaw[];
		fieldList: string[];
		fileMeta?: FileMeta;
	};
	settings?: {
		profileName?: string;
		rememberProfile?: boolean;
		rememberHidden?: boolean;
		rememberSort?: boolean;
	};
}

interface FormProps {
	onSubmit?: (submitData: SubmitData) => void;
}

const Form = ({ onSubmit }: FormProps) => {
	const [data, setData] = useState<CsvRowRaw[]>([]);
	const [fieldList, setFieldList] = useState<string[]>([]);
	const [fileMeta, setFileMeta] = useState<FileMeta>();
	const [profileName, setProfileName] = useState('');

	const { findProfileById } = useCsvProfileStore();

	const handleParsedResult = (
		result: ParseResult<unknown> & { fileMeta?: FileMeta },
	) => {
		if (result) {
			const {
				data: rows,
				meta: { fields },
				fileMeta,
			} = result;

			setData(rows as CsvRowRaw[]);
			setFieldList(fields ?? []);
			setFileMeta(fileMeta);

			if (fields?.length) {
				const schemaId = getSchemaHash(fields);
				const profile = findProfileById(schemaId);

				if (profile) {
					setProfileName(profile.name);
				} else {
					setProfileName('');
				}
			}
		}
	};

	const handleClear = () => {
		setData([]);
		setFieldList([]);
		setFileMeta(undefined);
		setProfileName('');
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		onSubmit?.({
			csv: {
				data,
				fieldList,
				fileMeta,
			},
			settings: {},
		});
	};

	return (
		<div className="flex justify-center">
			<form
				className="border border-slate-400 p-4 w-[600px]"
				onSubmit={handleSubmit}
				onReset={handleClear}
			>
				<CsvInput
					onValueCleared={handleClear}
					onValueParsed={handleParsedResult}
				/>
				{profileName && (
					<div className="text-sm">Found matching profile "{profileName}"</div>
				)}
				{/* <Settings /> */}
				<div className="flex gap-4 justify-center pt-4">
					<button
						className="border border-gray-200 text-slate-600 rounded-lg px-3 py-2 items-center"
						type="reset"
					>
						Reset
					</button>
					<button
						className="bg-gray-200 text-slate-600 rounded-lg px-3 py-2 items-center disabled:opacity-60"
						type="submit"
						disabled={!data.length}
					>
						Process
					</button>
				</div>
			</form>
		</div>
	);
};

export default Form;
