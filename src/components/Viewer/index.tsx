import { Tab } from '@headlessui/react';
import { Fragment, useMemo } from 'react';
import { v4 } from 'uuid';
import Form, { SubmitData } from '~/components/Form';
import Sheet from '~/components/Sheet';
import { CsvRow, CsvRowRaw } from '~/data/models/csv';
import {
	generateDefaultProfileSchema,
	getSchemaHash,
} from '~/data/models/csvProfile';
import { useCsvProfileStore } from '~/data/state/csvProfileSlice';
import { useBoundStore } from '~/data/state/store';
import { tw } from '~/lib/utils/alias';
import Icon from '../Icon';

function createRowFieldDefault(columnName: string, value: string) {
	return {
		name: columnName,
		originalValue: value,
		value,
	};
}

function processRawRow(data: CsvRowRaw) {
	return Object.entries(data).reduce((row, entry) => {
		const [key, value] = entry;
		return {
			...row,
			[key]: createRowFieldDefault(key, value),
		};
	}, {} as CsvRow);
}

interface ViewerProps {
	className?: string;
}

const Viewer = ({ className }: ViewerProps) => {
	const {
		activeTabId,
		closeTab,
		createTab,
		files,
		removeFile,
		setActiveTab,
		setColumnOrder,
		setFile,
		setTabFile,
		tabs,
	} = useBoundStore();

	const { findProfileById, addProfile, profiles, updateProfileSchema } =
		useCsvProfileStore();

	const fileIds = Object.keys(files);
	const activeTabFileId = tabs[activeTabId]?.fileId;

	const handleClearTabAndFile = () => {
		const fileId = tabs[activeTabId]?.fileId;
		if (fileId) {
			removeFile(fileId);
		}
		if (Object.keys(tabs).length > 1) {
			closeTab(activeTabId);
		} else {
			setTabFile(activeTabId, null);
		}
	};

	const handleSubmit = (data: SubmitData) => {
		const { data: rows, fieldList, fileMeta } = data.csv;

		const fileId = v4();

		const transformedRows = rows.map(processRawRow);

		const profile = findProfileById(getSchemaHash(fieldList));

		setFile(
			{
				data: transformedRows,
				columns: fieldList.map((field, idx) => {
					if (profile) {
						const { ordinal, visible } = profile.schema[field];
						return {
							name: field,
							ordinal,
							visible,
						};
					}
					return {
						name: field,
						ordinal: idx,
						visible: true,
					};
				}),
				fileMeta,
			},
			fileId,
		);

		if (activeTabId && fileMeta) {
			setTabFile(activeTabId, { ...fileMeta, fileId });
		}

		// if not already loaded before, generate and save a profile with defaults
		if (!findProfileById(getSchemaHash(fieldList))) {
			const schema = generateDefaultProfileSchema(fieldList);
			const profileCount = Object.keys(profiles).length;
			const name =
				fileMeta?.name ??
				`Untitled Profile${profileCount === 0 ? ' 1' : ' ' + profileCount + 1}`;

			addProfile({
				schema,
				name,
			});
		}
	};

	const tabEntries = useMemo(() => Object.entries(tabs), [tabs]);

	return (
		<div className={tw('flex flex-col h-full', className)}>
			<Tab.Group>
				<Tab.Panels className="flex-grow min-h-0 overflow-y-scroll">
					{tabEntries.map((tabEntry) => {
						const [tabId] = tabEntry;
						return (
							<Tab.Panel key={tabId} className="p-4">
								{activeTabFileId && !!files[activeTabFileId] ? (
									<Sheet
										data={files[activeTabFileId]}
										onColumnOrderChange={(columnOrderState) => {
											setColumnOrder(fileIds[0], columnOrderState);

											const profileId = getSchemaHash(columnOrderState);
											const profile = findProfileById(profileId);

											if (profile) {
												const schemaOrdinalUpdate = columnOrderState.reduce(
													(state, column, idx) => {
														return {
															...state,
															[column]: {
																ordinal: idx,
															},
														};
													},
													{},
												);
												updateProfileSchema(profileId, schemaOrdinalUpdate);
											}
										}}
									/>
								) : (
									<Form onSubmit={handleSubmit} />
								)}
							</Tab.Panel>
						);
					})}
				</Tab.Panels>
				<Tab.List className="flex items-stretch backdrop-blur-3xl bg-opacity-80 bg-white dark:bg-slate-800 border-t border-t-slate-700">
					{tabEntries.map((tabEntry) => {
						const [tabId, fileMeta] = tabEntry;
						const file = (!!fileMeta && files[fileMeta.fileId]) || undefined;
						return (
							<Tab as={Fragment} key={tabId}>
								{({ selected }) => (
									<div
										className={tw(
											'flex items-center text-gray-500 dark:text-white border-white border-b-2 border-r-2 border-r-indigo-500 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700',
											selected &&
												'border-t-indigo-500 bg-slate-100 dark:bg-slate-700',
										)}
									>
										<button
											className="px-4 py-2"
											type="button"
											onClick={() => setActiveTab(tabId)}
										>
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
						onClick={() => {
							const newTabId = createTab();
							setActiveTab(newTabId);
						}}
					>
						<Icon name="PlusIcon" />
					</button>
				</Tab.List>
			</Tab.Group>
		</div>
	);
};

export default Viewer;
