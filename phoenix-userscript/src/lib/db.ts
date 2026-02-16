import Dexie, { type Table } from 'dexie';

export interface SavedEntry {
  id?: number;
  domain: string;
  url: string;
  fieldId: string;    // Heuristic-based ID
  fieldName: string;  // Label or placeholder
  value: string;
  timestamp: number;
  isSubmitted: boolean;
}

export class PhoenixDB extends Dexie {
  entries!: Table<SavedEntry>;

  constructor() {
    super('PhoenixSotaDB');
    this.version(1).stores({
      entries: '++id, domain, [domain+fieldId], timestamp, isSubmitted'
    });
  }

  async save(entry: Omit<SavedEntry, 'id'>) {
    return await this.entries.put(entry as SavedEntry);
  }

  async getHistory(domain: string, fieldId: string) {
    return await this.entries
      .where({ domain, fieldId })
      .reverse()
      .sortBy('timestamp');
  }
}

export const db = new PhoenixDB();
