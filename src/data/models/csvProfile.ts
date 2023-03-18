type SchemaDataType = 'string' | 'float' | 'number' | 'date';

interface SchemaFieldSettings {
	readonly name: string;
	ordinal: number;
	visible: boolean;
	dataType: SchemaDataType;
}

export default interface CsvProfile {
	name: string;
	headerSchemaMap: Map<string, SchemaFieldSettings>;
}
