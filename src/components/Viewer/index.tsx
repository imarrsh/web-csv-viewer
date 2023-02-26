import { unparse } from 'papaparse';
import { useState } from 'react';
import Form, { SubmitData } from '~/components/Form';
import { FileMeta } from '~/components/Form/TextFileInput';
import Sheet from '~/components/Sheet';
import { CsvRow } from '~/data/types';

function download(filename: string, text: string) {
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

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

	const handleDownload = (data: CsvRow[]) => {
		const csv = unparse(data);
		download(fileInfo?.name ?? 'download.csv', csv);
	};

	return (
		<div>
			{data && data.length > 0 && columns && columns.length > 0 ? (
				<Sheet data={data} columns={columns} title={fileInfo?.name} onClear={clearData} onDownload={handleDownload} />
			) : (
				<Form onSubmit={handleSubmit} />
			)}
		</div>
	);
};

export default Viewer;
