import Dexie, { type Table } from 'dexie';
import { z } from 'zod';
import { type Delta, NanoDelta } from './compression';

export const FormEntrySchema = z.object({
  id: z.number().optional(),
  domain: z.string(),
  url: z.string(),
  fieldId: z.string(),
  fieldName: z.string(),
  fieldType: z.string(),
  value: z.string(), // Reconstructed value or snapshot
  delta: z.any().optional(), // Delta from previous entry
  timestamp: z.number(),
  isSubmitted: z.boolean(),
  version: z.string()
});

export type FormEntry = z.infer<typeof FormEntrySchema>;

export class PhoenixDatabase extends Dexie {
  entries!: Table<FormEntry>;

  constructor() {
    super('PhoenixRecoveryDB');
    this.version(1).stores({
      entries: '++id, domain, [domain+fieldId], timestamp, isSubmitted'
    });
  }

  async save(entry: Omit<FormEntry, 'id' | 'version' | 'delta'>) {
    return this.transaction('rw', this.entries, async () => {
      // Find previous entry for this field to calculate delta
      const prev = await this.entries
        .where({ domain: entry.domain, fieldId: entry.fieldId })
        .reverse()
        .first();

      let delta = null;
      if (prev && entry.value.length > 100) {
         delta = NanoDelta.diff(prev.value, entry.value);
      }

      const data = FormEntrySchema.parse({
        ...entry,
        delta,
        version: '2026.02.15.01'
      });
      return await this.entries.put(data);
    });
  }
}

export const db = new PhoenixDatabase();
