import simpleHash from '~/lib/utils/simpleHash';
import { CsvColumn } from './csv';

type SchemaDataType = 'string' | 'float' | 'integer' | 'date';

interface SchemaColumnSettings extends CsvColumn {
	dataType: SchemaDataType;
	// ? jsonLogic for transforms?
}

export default interface CsvProfile {
	name: string;
	schema: Record<string, SchemaColumnSettings>;
}

export function generateDefaultProfileSchema(
	columns: string[],
): CsvProfile['schema'] {
	return columns.reduce((profile, col, index) => {
		return {
			...profile,
			[col]: {
				dataType: 'string',
				name: col,
				ordinal: index,
				visible: true,
			},
		};
	}, {});
}

export function getSchemaHash(columns: string[]) {
	return simpleHash(columns.join('+'));
}
