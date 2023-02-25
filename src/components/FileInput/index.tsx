import { parse, ParseResult } from 'papaparse';

interface FileInputProps {
  onFileLoaded?: (parseResult: ParseResult<unknown>) => void;
}

const FileInput = ({ onFileLoaded }: FileInputProps) => {

  const handleParseFile = (file: File) => {
    const reader = new FileReader();
        
    reader.onload = (e => {
      // assume string for now, since we're working with csv
      const csv = e.target?.result as string;
      if (csv) {
        // todo - handle array buffer
        // if (ArrayBuffer.isView(csv)) {}...

        try {
          const data = parse(csv, {
            header: true,
            skipEmptyLines: true,
          });

          console.log({csv, data});

          onFileLoaded?.(data);

        } catch (ex) {
          console.error(`Couldn't parse csv`, ex);
        }
      }
    });

    reader.readAsText(file);
  }

  return (
    <input type="file" accept=".csv" onChange={(e) => {
      const {files} = e.target;
      const file = files?.[0];
      
      if (file) {
        const { type } = file;

        if (type === 'text/csv') {
          handleParseFile(file);
        }
      }
    }}/>
  );
}

export default FileInput;