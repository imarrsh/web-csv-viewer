import { FileMeta } from './file';

export type CsvField = {
	name: string;
	ordinal: number;
	originalValue: string;
	value: unknown;
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
	columns: string[];
	/** Metadata about the uploaded file */
	fileMeta?: FileMeta;
};
