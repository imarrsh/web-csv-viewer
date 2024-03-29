import { parse, ParseResult } from 'papaparse';
import { FileMeta } from '~/data/models/file';
import TextFileInput from './TextFileInput';

interface CsvInputProps {
	onValueCleared?: () => void;
	onValueParsed?: (
		parseResult: ParseResult<unknown> & { fileMeta?: FileMeta },
	) => void;
}

const CsvInput = ({ onValueCleared, onValueParsed }: CsvInputProps) => {
	const processCsv = (csv: string) => {
		try {
			return parse(csv, {
				header: true,
				skipEmptyLines: true,
			});
		} catch (ex) {
			console.error(`Couldn't parse csv`, ex);
		}
	};

	const handleChange = ({
		value,
		meta,
	}: {
		value: string;
		meta?: FileMeta;
	}) => {
		const csv = processCsv(value);
		if (csv) {
			onValueParsed?.({ ...csv, fileMeta: meta });
		}
	};

	return (
		<TextFileInput onChangeValue={handleChange} onClear={onValueCleared} />
	);
};

export default CsvInput;
