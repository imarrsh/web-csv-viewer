import { useState } from 'react';
import Form, { SubmitData } from '~/components/Form';
import { FileMeta } from '~/components/Form/TextFileInput';
import Sheet from '~/components/Sheet';
import { CsvRow } from '~/data/types';

const Viewer = () => {
	const [data, setData] = useState<CsvRow[]>([]);
	const [columns, setColumns] = useState<string[]>([]);
	const [fileInfo, setFileInfo] = useState<FileMeta>();

	const clearData = () => {
		setData([]);
		setColumns([]);
	};

	const handleSubmit = (data: SubmitData) => {
		const { data: rows, fieldList, fileMeta } = data.csv;
		setData(rows);
		setColumns(fieldList);
		setFileInfo(fileMeta);
	};

	return (
		<div>
			{data && data.length > 0 && columns && columns.length > 0 ? (
				<Sheet data={data} columns={columns} title={fileInfo?.name} onClear={clearData} />
			) : (
				<Form onSubmit={handleSubmit} />
			)}
		</div>
	);
};

export default Viewer;
