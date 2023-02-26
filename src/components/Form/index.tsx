import { ParseResult } from 'papaparse';
import { FormEvent, useState } from 'react';
import { CsvRow } from '~/data/types';
import CsvInput from './CsvInput';
import Settings from './Settings';
import { FileMeta } from './TextFileInput';

export interface SubmitData {
	csv: {
		data: CsvRow[];
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
	const [data, setData] = useState<CsvRow[]>([]);
	const [fieldList, setFieldList] = useState<string[]>([]);
	const [fileMeta, setFileMeta] = useState<FileMeta>();

	const handleParsedResult = (result: ParseResult<unknown> & { fileMeta?: FileMeta }) => {
		if (result) {
			const { data: rows, meta, fileMeta } = result;

			setData(rows as CsvRow[]);
			setFieldList(meta?.fields ?? []);
			setFileMeta(fileMeta);
		}
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
		<form className="border border-slate-400 p-4" onSubmit={handleSubmit}>
			<CsvInput onValueParsed={handleParsedResult} />
			<Settings />
			<div className="flex gap-4">
				<button className="border border-gray-200 text-slate-600 rounded-lg px-3 py-2 items-center" type="reset">
					Reset
				</button>
				<button className="bg-gray-200 text-slate-600 rounded-lg px-3 py-2 items-center" type="submit">
					Process
				</button>
			</div>
		</form>
	);
};

export default Form;
