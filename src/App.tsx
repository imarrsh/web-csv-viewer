import { useState } from "react";
import Settings from "~/components/Settings";
import { CsvRow } from "~/data/types";
import FileInput from "~/components/FileInput";
import type {ParseResult, ParseError, ParseMeta} from 'papaparse';
import Sheet from "./components/Sheet";

function App() {
  
  const [ data, setData ] = useState<CsvRow[]>([]);
  const [ errors, setErrors] = useState<ParseError[]>([]);
  const [ meta, setMeta] = useState<ParseMeta>();

  const handleFileLoaded = (data: ParseResult<unknown>) => {
    const { data: rows, meta, errors } = data;

    setData(rows as CsvRow[]);
    setMeta(meta)
    setErrors(errors);
  }

  const clear= () => {
    setData([]);
    setMeta(undefined)
    setErrors([]);
  }

  return (
    <div>
      <h1 className="text-center text-2xl">Web CSV Viewer</h1>
      <p>Upload a CSV file and re-arrange and hide columns. We'll remember those settings for future uploads of csv files with the same schema.</p>
      <FileInput onFileLoaded={handleFileLoaded}/>
      <Settings onClear={clear}/>
      {data && data.length > 0 && meta && meta?.fields && (
        <Sheet data={data} columns={meta?.fields}/>
      )}
    </div>
  )
}

export default App;
