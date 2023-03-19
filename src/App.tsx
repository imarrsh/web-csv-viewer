import Icon from './components/Icon';
import Viewer from './components/Viewer';
import { useBoundStore } from './data/state/store';

function App() {
	const { tabs, activeTabId } = useBoundStore();
	const tabFile = tabs[activeTabId];
	const tabHasFile = tabFile != null;

	return (
		<div className="flex flex-col h-screen">
			<header className="shadow-lg sticky top-0 backdrop-blur-3xl bg-opacity-80 bg-white">
				<div className="flex gap-4 px-4 py-2 items-center">
					<Icon className="w-6 h-6" name="TableCellsIcon" />
					<h1 className="text-lg">Web CSV Viewer</h1>
					{tabHasFile && (
						<div className="flex items-center gap-4">
							<Icon name="ChevronRightIcon" />
							<h2 className="text-sm">{tabFile.name}</h2>
						</div>
					)}
					<div className="flex-grow" />
					<div className="flex items-center divide-x">
						<div className="flex items-center gap-2 pr-2">
							<button
								type="button"
								className="flex gap-2 border-0 items-center hover:bg-green-100 transition-colors rounded-md text-green-700 py-2 px-3"
								// onClick={prepareDownload}
							>
								<Icon
									className="text-green-900"
									name="ArrowDownTrayIcon"
									variant="solid"
								/>
							</button>
							<button
								type="button"
								className="flex gap-2 border-0 items-center hover:bg-slate-100 transition-colors rounded-md text-slate-700 py-2 px-3"
								// onClick={prepareDownload}
							>
								<Icon
									className="text-slate-900"
									name="AdjustmentsVerticalIcon"
									variant="solid"
								/>
							</button>
						</div>
						<div className="flex items-center gap-2 pl-2 border-slate-500">
							<button
								type="button"
								className="flex gap-2 border-0 items-center hover:bg-slate-100 transition-colors rounded-md text-slate-700 py-2 px-3"
								// onClick={prepareDownload}
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
