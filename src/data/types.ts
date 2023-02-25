export type CsvRow = Record<string, any>;

export interface CsvSettings {
  rememberSchema?: boolean;
  autoReorder?: boolean;
  autoHide?: boolean;
}

export interface AppSettings extends CsvSettings {};