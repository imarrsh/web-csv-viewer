import { FileMeta, getFileMetadata } from '~/data/models/file';

interface TextFileInputProps {
	onChangeValue?: (changeResult: { value: string; meta?: FileMeta }) => void;
	onClear?: () => void;
}

const TextFileInput = ({ onChangeValue, onClear }: TextFileInputProps) => {
	const handleReadText = (file: File) => {
		const reader = new FileReader();

		// set onload handler for when we read
		reader.onload = (e) => {
			// assume string for now, since we're working with csv
			const csv = e.target?.result as string;
			if (csv) {
				onChangeValue?.({ value: csv, meta: getFileMetadata(file) });
			}
		};

		// read file
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
				} else {
					onClear?.();
				}
			}}
		/>
	);
};

export default TextFileInput;
