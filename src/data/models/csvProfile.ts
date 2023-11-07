import simpleHash from '~/lib/utils/simpleHash';
import { CsvColumn } from './csv';

type SchemaDataType = 'string' | 'float' | 'integer' | 'date';

interface SchemaColumnSettings extends CsvColumn {
	dataType: SchemaDataType;
	// ? jsonLogic for transforms?
}

/**
 * A schema follows this format:
 *
 * @example
 * {
 * 	['<column name>'] : { SchemaColumnSettings },
 * }
 */
export type ProfileSchema = Record<string, SchemaColumnSettings>;

/**
 * A CsvProfile follows this format:
 *
 * @example
 * {
 *  name,
 *  schema: ['<column name>'] : { SchemaColumnSettings },
 * }
 */
export default interface CsvProfile {
	name: string;
	schema: ProfileSchema;
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

/**
 * Converts a column name list into a string hash. Useful for fingerprinting
 * csv header schemas.
 */
export function getSchemaHash(columns: string[]) {
	return simpleHash(
		// sort so that incoming column order shouldn't matter
		columns.toSorted((a, b) => a.localeCompare(b)).join('+'),
	);
}
