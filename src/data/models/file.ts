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
