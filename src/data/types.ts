// type CsvFileMetadata = {};

export interface CsvSettings {
	autoReorder?: boolean;
	autoHide?: boolean;
}

// type SchemaDataType = 'string' | 'float' | 'number' | 'date';

// interface SchemaFieldSettings {
// 	readonly name: string;
// 	ordinal: number;
// 	visible: boolean;
// 	dataType: SchemaDataType;
// }

// interface CsvProfile {
// 	name: string;
// 	headerSchemaMap: Map<string, SchemaFieldSettings>;
// }

export type AppSettings = CsvSettings;

/*
	Storage:
		list of csv profiles
			settings for a given profile
				name
				fieldsSchema *best way to store this so that future uploads can be auto matched?
				schemaSettings
					fields
						ordinal
						visible
				
	Profile: 
		name: "Bank Transactions"
		fieldsSchema:
			"Transaction ID,Posting Date,Effective Date,Transaction Type,Amount,Check Number,Reference Number,Description,Transaction Category,Type,Balance,Memo,Extended Description"
		schemaSettings:
			fields: [
				{
					name: "Transaction ID"
					ordinal: 0
					visible: false
					dataType: 'string'
				},
			]
*/
