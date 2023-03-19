import { Tab } from '@headlessui/react';
import { unparse } from 'papaparse';
import { Fragment } from 'react';
import { v4 } from 'uuid';
import Form, { SubmitData } from '~/components/Form';
import Sheet from '~/components/Sheet';
import { CsvRow } from '~/data/models/file';
import { useBoundStore } from '~/data/state/store';
import { tw } from '~/lib/utils/alias';
import Icon from '../Icon';

function download(filename: string, text: string) {
	const element = document.createElement('a');
	element.setAttribute(
		'href',
		'data:text/csv;charset=utf-8,' + encodeURIComponent(text),
	);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

interface ViewerProps {
	className?: string;
}

const Viewer = ({ className }: ViewerProps) => {
	const {
		files,
		setFile,
		setTabFile,
		removeFile,
		activeTabId,
		tabs,
		createTab,
	} = useBoundStore();
	const fileIds = Object.keys(files);
	console.log({ fileIds });

	const handleClearTabAndFile = () => {
		const fileId = tabs[activeTabId]?.fileId;
		if (fileId) {
			setTabFile(activeTabId, null);
			removeFile(fileId);
		}
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
		if (activeTabId && fileMeta) {
			setTabFile(activeTabId, { ...fileMeta, fileId });
		}
	};

	const handleDownload = (data: CsvRow[], fileName?: string) => {
		const csv = unparse(data);
		download(fileName ?? 'download.csv', csv);
	};

	return (
		<div className={tw('flex flex-col h-full', className)}>
			<Tab.Group>
				<Tab.Panels className="flex-grow min-h-0 overflow-y-scroll">
					<Tab.Panel className="p-4">
						{fileIds.length > 0 ? (
							<Sheet
								data={files[fileIds[0]].data}
								columns={files[fileIds[0]].columns}
								title={files[fileIds[0]].fileMeta?.name}
								onClear={handleClearTabAndFile}
								onDownload={handleDownload}
							/>
						) : (
							<Form onSubmit={handleSubmit} />
						)}
					</Tab.Panel>
				</Tab.Panels>
				<Tab.List className="flex items-stretch backdrop-blur-3xl bg-opacity-80 bg-white border-t border-t-slate-700">
					{Object.entries(tabs).map((tabEntry) => {
						const [tabId, fileMeta] = tabEntry;
						const file = (!!fileMeta && files[fileMeta.fileId]) || undefined;
						return (
							<Tab as={Fragment} key={tabId}>
								{({ selected }) => (
									<div
										className={tw(
											'flex items-center text-gray-500 border-white border-b-2 border-r-2 border-r-indigo-500 hover:bg-slate-100',
											selected && 'border-t-indigo-500',
										)}
									>
										<button className="px-4 py-2" type="button">
											{file?.fileMeta?.name ?? 'Untitled'}{' '}
										</button>
										<button
											type="button"
											className="px-4 py-2"
											onClick={handleClearTabAndFile}
										>
											<Icon name="XCircleIcon" />
										</button>
									</div>
								)}
							</Tab>
						);
					})}
					<button
						type="button"
						className="flex items-center px-4 py-2 border-r border-r-indigo-500 hover:bg-slate-100"
						onClick={() => {}}
					>
						<Icon name="PlusIcon" />
					</button>
				</Tab.List>
			</Tab.Group>
		</div>
	);
};

export default Viewer;
