import Viewer from './components/Viewer';

function App() {
	return (
		<div className="p-4">
			<h1 className="text-center text-2xl m-2">Web CSV Viewer</h1>
			{/* <p className="mb-4">
				Upload a CSV file and re-arrange and hide columns. We'll remember those settings for future uploads of csv files
				with the same schema.
			</p> */}
			<Viewer />
		</div>
	);
}

export default App;
