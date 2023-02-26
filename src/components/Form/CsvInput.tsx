import { parse, ParseResult } from 'papaparse';
import TextFileInput, { FileMeta } from './TextFileInput';

interface CsvInputProps {
	onValueParsed?: (parseResult: ParseResult<unknown> & { fileMeta?: FileMeta }) => void;
}

const CsvInput = ({ onValueParsed }: CsvInputProps) => {
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

	const handleChange = ({ value, meta }: { value: string; meta?: FileMeta }) => {
		const csv = processCsv(value);
		if (csv) {
			onValueParsed?.({ ...csv, fileMeta: meta });
		}
	};

	return <TextFileInput onChangeValue={handleChange} />;
};

export default CsvInput;
