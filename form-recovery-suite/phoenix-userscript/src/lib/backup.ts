import { db } from './db';

export async function exportToJSON() {
  const entries = await db.entries.toArray();
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `phoenix_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromJSON(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        await db.transaction('rw', db.entries, async () => {
          for (const entry of data) {
             delete entry.id; // Allow auto-increment
             await db.entries.put(entry);
          }
        });
        resolve(true);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}
