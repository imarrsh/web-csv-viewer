import Icon from './components/Icon';
import Viewer from './components/Viewer';

function App() {
	return (
		<div>
			<header className="flex gap-4 items-center px-4 py-2 shadow-lg">
				<Icon className="w-6 h-6" name="TableCellsIcon" />
				<h1 className="text-lg">Web CSV Viewer</h1>
			</header>
			<main className="p-4">
				{/* <p className="mb-4">
				Upload a CSV file and re-arrange and hide columns. We'll remember those settings for future uploads of csv files
				with the same schema.
			</p> */}
				<Viewer />
			</main>
		</div>
	);
}

export default App;
