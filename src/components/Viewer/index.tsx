import { Tab } from '@headlessui/react';
import { unparse } from 'papaparse';
import { v4 } from 'uuid';
import Form, { SubmitData } from '~/components/Form';
import Sheet from '~/components/Sheet';
import { CsvRow } from '~/data/models/file';
import { useBoundStore } from '~/data/state/store';

function download(filename: string, text: string) {
	const element = document.createElement('a');
	element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

interface ViewerProps {
	activeTabId: string;
}

const Viewer = ({ activeTabId }: ViewerProps) => {
	const { files, setFile, linkFile, removeFile } = useBoundStore((state) => state);

	const fileIds = Object.keys(files);
	// const [data, setData] = useState<CsvRow[]>([]);
	// const [columns, setColumns] = useState<string[]>([]);
	// const [fileInfo, setFileInfo] = useState<FileMeta>();

	const clearData = () => {
		// setData([]);
		// setColumns([]);
	};

	const handleSubmit = (data: SubmitData) => {
		const { data: rows, fieldList, fileMeta } = data.csv;
		const fileId = v4();
		setFile(
			{
				data: rows,
				columns: fieldList,
				fileMeta,
			},
			fileId,
		);
		if (fileMeta) {
			console.log('linking file');
			linkFile(activeTabId, { ...fileMeta, fileId });
		}
	};

	const handleDownload = (data: CsvRow[], fileName?: string) => {
		const csv = unparse(data);
		download(fileName ?? 'download.csv', csv);
	};

	return (
		<div>
			<Tab.Panels>
				<Tab.Panel>
					{fileIds.length > 0 ? (
						<Sheet
							data={files[fileIds[0]].data}
							columns={files[fileIds[0]].columns}
							title={files[fileIds[0]].fileMeta?.name}
							onClear={clearData}
							onDownload={handleDownload}
						/>
					) : (
						<Form onSubmit={handleSubmit} />
					)}
				</Tab.Panel>
			</Tab.Panels>
		</div>
	);
};

export default Viewer;
