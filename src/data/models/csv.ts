import { unparse } from 'papaparse';
import { FileMeta } from './file';

export type CsvField = {
	name: string;
	originalValue: string;
	value: unknown;
};

export type CsvColumn = {
	name: string;
	ordinal: number;
	visible: boolean;
};

/**
 * Represents a single row where key is column name and value is the data for a given column
 */
export type CsvRow = Record<string, CsvField>;

/**
 * Represents a raw CSV row where key is column name and value is the value for the column without any metadata
 */
export type CsvRowRaw = Record<string, string>;

export type CsvFile = {
	/** Row data */
	data: CsvRow[];
	/** Column Names */
	columns: CsvColumn[];
	/** Metadata about the uploaded file */
	fileMeta?: FileMeta;
};

const getColumnIndex = (file: CsvFile) => {
	return file.columns.reduce((columnMap, col) => {
		const { visible, ordinal } = col;
		columnMap[col.name] = { visible, ordinal };
		return columnMap;
	}, {} as Record<string, { visible: boolean; ordinal: number }>);
};

export const prepareDownload = (file: CsvFile) => {
	const columnIndex = getColumnIndex(file);

	return file.data.map((dataRow) => {
		return Object.entries(dataRow)
			.sort(([aName], [bName]) => {
				return columnIndex[aName].ordinal - columnIndex[bName].ordinal;
			})
			.reduce((row, [colName, value]) => {
				console.log({ colName });
				if (columnIndex[colName].visible) {
					row[colName] = value;
				}
				return row;
			}, {} as CsvRow);
	});
};

const processRows = (rows: CsvRow[]) =>
	rows.map((row) =>
		Object.entries(row).reduce((row, keyAndData) => {
			const [key, field] = keyAndData;
			return {
				...row,
				[key]: field.value,
			};
		}, {}),
	);

export const rowsToCsv = (data: CsvRow[]) => {
	const processedRows = processRows(data);

	return unparse(processedRows);
};

export const rowsToPasteable = (data: CsvRow[]) => {
	const processedRows = processRows(data);

	return unparse(processedRows, { delimiter: '\t' });
};
