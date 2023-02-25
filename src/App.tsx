import { useState } from "react";
import Settings from "~/components/Settings";
import { CsvRow } from "~/data/types";

function App() {
  
  const [ data, setData ] = useState<CsvRow[]>([]);

  return (
    <div>
      <h1 className="text-center text-2xl">Web CSV Viewer</h1>
      <p>Upload a CSV file and re-arrange and hide columns. We'll remember those settings for future uploads of csv files with the same schema.</p>
      <input type="file" accept=".csv"/>
      <Settings/>
    </div>
  )
}

export default App;
