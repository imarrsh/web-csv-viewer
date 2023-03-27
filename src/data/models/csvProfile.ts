type SchemaDataType = 'string' | 'float' | 'integer' | 'date';

interface SchemaFieldSettings {
	readonly name: string;
	ordinal: number;
	visible: boolean;
	dataType: SchemaDataType;
	// jsonLogic for transforms?
}

export default interface CsvProfile {
	name: string;
	schema: Record<string, SchemaFieldSettings>;
}
