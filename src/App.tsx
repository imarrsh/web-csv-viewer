import { Tab } from '@headlessui/react';
import { Fragment } from 'react';
import { twMerge as tw } from 'tailwind-merge';
import Icon from './components/Icon';
import Viewer from './components/Viewer';
import { useBoundStore } from './data/state/store';

function App() {
	const { tabs, activeTabId, createTab, files } = useBoundStore((state) => state);
	console.log({ tabs, files });
	return (
		<div className="relative">
			<Tab.Group>
				<header className="flex items-stretch shadow-lg sticky">
					<div className=" flex gap-4 px-4 py-2">
						<Icon className="w-6 h-6" name="TableCellsIcon" />
						<h1 className="text-lg">Web CSV Viewer</h1>
					</div>
					<Tab.List className="flex items-stretch">
						{Object.entries(tabs).map((tabEntry) => {
							const [tabId, fileMeta] = tabEntry;
							const file = (!!fileMeta && files[fileMeta.fileId]) || undefined;
							return (
								<Tab as={Fragment} key={tabId}>
									{({ selected }) => (
										<button
											className={tw(
												'flex gap-2 items-center text-gray-500 border-white border-b-2 px-4 py-2',
												selected && 'border-b-indigo-500',
											)}
											type="button"
										>
											{file?.fileMeta?.name ?? 'Untitled'} <Icon name="XCircleIcon" />
										</button>
									)}
								</Tab>
							);
						})}
					</Tab.List>
				</header>
				<main className="p-4">
					{/* <p className="mb-4">
				Upload a CSV file and re-arrange and hide columns. We'll remember those settings for future uploads of csv files
				with the same schema.
			</p> */}
					<Viewer activeTabId={activeTabId} />
				</main>
			</Tab.Group>
		</div>
	);
}

export default App;
