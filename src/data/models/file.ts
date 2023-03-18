export type CsvRow = Record<string, any>;

export const getFileMetadata = (file: File) => {
	const { name, size, lastModified, type } = file;
	return {
		name,
		size,
		lastModified,
		type,
	};
};

export type FileMeta = ReturnType<typeof getFileMetadata>;

export type CsvFile = {
	data: CsvRow[];
	columns: string[];
	file: FileMeta;
};
