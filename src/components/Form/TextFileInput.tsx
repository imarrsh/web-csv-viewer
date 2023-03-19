import { FileMeta, getFileMetadata } from '~/data/models/file';

interface TextFileInputProps {
	onChangeValue?: (changeResult: { value: string; meta?: FileMeta }) => void;
}

const TextFileInput = ({ onChangeValue }: TextFileInputProps) => {
	const handleReadText = (file: File) => {
		const reader = new FileReader();

		reader.onload = (e) => {
			// assume string for now, since we're working with csv
			const csv = e.target?.result as string;
			if (csv) {
				onChangeValue?.({ value: csv, meta: getFileMetadata(file) });
			}
		};

		reader.readAsText(file);
	};

	return (
		<input
			type="file"
			accept=".csv"
			onChange={(e) => {
				const { files } = e.target;
				const file = files?.[0];

				if (file) {
					const { type } = file;

					if (type === 'text/csv') {
						handleReadText(file);
					}
				}
			}}
		/>
	);
};

export default TextFileInput;
