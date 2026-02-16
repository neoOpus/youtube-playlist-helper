import Dexie, { type Table } from 'dexie';

export interface FormEntry {
  id?: number;
  formId: string;      // Logical form identifier
  fieldId: string;     // Unique field identifier (path/heuristic)
  fieldName: string;   // Field name/label
  fieldType: string;   // input, textarea, contenteditable
  value: string;       // The saved text
  timestamp: number;   // When it was saved
  domain: string;      // Hostname
  url: string;         // Full URL
  sessionId: string;   // Grouped session
}

export interface FormMetadata {
  id?: number;
  domain: string;
  isBlacklisted: boolean;
  lastUsed: number;
}

export class PhoenixDatabase extends Dexie {
  entries!: Table<FormEntry>;
  metadata!: Table<FormMetadata>;

  constructor() {
    super('PhoenixRecoveryDB');
    this.version(1).stores({
      entries: '++id, [domain+fieldId], timestamp, sessionId, formId',
      metadata: '++id, domain'
    });
  }
}

export const db = new PhoenixDatabase();
