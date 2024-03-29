import { Menu, Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDialog } from '~/components/Dialog/context';
import Icon from '~/components/Icon';
import ProfileEditDialog from '~/components/ProfileEditDialog';
import Viewer from '~/components/Viewer';
import { useBoundStore } from '~/data/state/store';
import { download } from '~/lib/utils/dom';
import { prepareDownload, rowsToCsv, rowsToPasteable } from './data/models/csv';
import { getSchemaHash } from './data/models/csvProfile';
import { useCsvProfileStore } from './data/state/csvProfileSlice';

function App() {
	const { tabs, activeTabId, files, setColumnVisibility } = useBoundStore();
	const { updateProfileSchema, findProfileById } = useCsvProfileStore();
	const tabFile = tabs[activeTabId];
	const tabHasFile = tabFile != null;
	const activeFile = tabFile ? files[tabFile.fileId] : undefined;
	const { openDialog } = useDialog();

	const handleGetDownload = () => {
		if (activeFile) {
			const data = prepareDownload(activeFile);
			const csv = rowsToCsv(data);
			download(activeFile.fileMeta?.name ?? 'download.csv', csv);
		}
	};

	const handleSetClipboard = async () => {
		if (activeFile) {
			const data = prepareDownload(activeFile);
			const text = rowsToPasteable(data);

			await navigator.clipboard.writeText(text);
		}
	};

	const handleOpenSchemaDialog = () => {
		openDialog(
			<ProfileEditDialog
				action={activeFile ? 'edit' : 'create'}
				columns={activeFile?.columns}
			/>,
		);
	};

	return (
		<div className="bg-white dark:bg-slate-800 dark:text-white flex flex-col h-screen">
			<header className="bg-white dark:bg-slate-800 shadow-lg sticky top-0 backdrop-blur-3xl bg-opacity-80">
				<div className="flex gap-4 px-4 py-2 items-center">
					<Icon className="w-6 h-6" name="TableCellsIcon" />
					<h1 className="text-lg">Web CSV Viewer</h1>
					{tabHasFile && (
						<div className="flex items-center gap-2">
							<Icon name="ChevronRightIcon" />
							<div>
								<Menu as="div" className="relative inline-block text-left">
									<div>
										<Menu.Button className="inline-flex w-full justify-center items-center rounded-md px-4 py-2 gap-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700">
											{tabFile.name}
											<Icon name="ChevronDownIcon" />
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter="transition ease-out duration-100"
										enterFrom="transform opacity-0 scale-95"
										enterTo="transform opacity-100 scale-100"
										leave="transition ease-in duration-75"
										leaveFrom="transform opacity-100 scale-100"
										leaveTo="transform opacity-0 scale-95"
									>
										<Menu.Items className="absolute left-0 mt-2 w-96 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-slate-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
											<div className="px-1 py-1 ">
												<Menu.Item>
													{({ active }) => (
														<button
															className={`${
																active
																	? 'bg-slate-500 text-white'
																	: 'text-gray-900 dark:text-white'
															} group flex w-full items-center rounded-md px-2 py-2 gap-2 text-sm`}
														>
															<Icon name="SparklesIcon" />
															Apply Schema Profile
														</button>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<button
															type="button"
															className={`${
																active
																	? 'bg-slate-500 text-white'
																	: 'text-gray-900 dark:text-white'
															} group flex w-full items-center rounded-md px-2 py-2 gap-2 text-sm`}
															onClick={() => handleOpenSchemaDialog()}
														>
															<Icon name="PlusCircleIcon" />
															Edit Schema Profile
														</button>
													)}
												</Menu.Item>
											</div>
											<div className="px-1 py-1">
												<Menu.Item>
													{({ active }) => (
														<button
															className={`${
																active
																	? 'bg-slate-500 text-white'
																	: 'text-gray-900 dark:text-white'
															} group flex w-full items-center rounded-md px-2 py-2 gap-2 text-sm`}
														>
															<Icon name="TrashIcon" />
															Clear
														</button>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					)}
					<div className="flex-grow" />
					<div className="flex items-center divide-x">
						<div className="flex items-center gap-2 pr-2">
							<button
								type="button"
								className="flex gap-2 border-0 items-center hover:bg-green-100 transition-colors rounded-md text-green-700 py-2 px-3"
								onClick={handleSetClipboard}
							>
								<Icon
									className="text-gray-200"
									name="ClipboardDocumentCheckIcon"
									variant="solid"
								/>
							</button>
							<button
								type="button"
								className="flex gap-2 border-0 items-center hover:bg-green-100 transition-colors rounded-md text-green-700 py-2 px-3"
								onClick={handleGetDownload}
							>
								<Icon
									className="text-gray-200"
									name="ArrowDownTrayIcon"
									variant="solid"
								/>
							</button>
							<Popover className="relative">
								<Popover.Button className="flex gap-2 items-center py-2 px-3 bg-slate-400 rounded-md">
									<Icon
										className="text-gray-700"
										name="AdjustmentsVerticalIcon"
										variant="solid"
									/>
								</Popover.Button>

								<Popover.Panel className="absolute right-0 top-10 z-10 bg-white dark:bg-slate-700 p-2 rounded-md shadow-lg divide-y divide-slate-500">
									<h3 className="text-lg font-bold px-4 py-2">Columns</h3>
									<div>
										{activeFile?.columns.map((col) => {
											return (
												<label
													key={col.name}
													className="flex gap-2 py-2 px-3 hover:bg-gray-200 dark:hover:bg-slate-500 items-center whitespace-nowrap rounded"
												>
													<input
														type="checkbox"
														checked={col.visible}
														onChange={(e) => {
															if (tabFile?.fileId) {
																const visible = e.currentTarget.checked;
																setColumnVisibility(
																	tabFile?.fileId,
																	col.name,
																	visible,
																);
																// perhaps we have a checkbox to 'remember' changes
																const profileId = getSchemaHash(
																	activeFile.columns.map((col) => col.name),
																);
																const profile = findProfileById(profileId);
																if (profile) {
																	updateProfileSchema(profileId, {
																		[col.name]: {
																			visible: visible,
																		},
																	});
																}
															}
														}}
													/>
													{col.name}
												</label>
											);
										})}
									</div>
								</Popover.Panel>
							</Popover>
						</div>
						<div className="flex items-center gap-2 pl-2 border-slate-500">
							<button
								type="button"
								className="flex gap-2 border-0 items-center hover:bg-slate-100 transition-colors rounded-md text-slate-700 py-2 px-3"
								// onClick={}
							>
								<Icon
									className="text-slate-900"
									name="Cog8ToothIcon"
									variant="solid"
								/>
							</button>
						</div>
					</div>
				</div>
			</header>
			<main className="flex-grow min-h-0">
				<Viewer />
			</main>
		</div>
	);
}

export default App;
