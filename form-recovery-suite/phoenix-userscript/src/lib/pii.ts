/**
 * Intelligent PII Masking (Clever Trick #4)
 * Redacts emails and probable keys from the UI preview.
 */
export function maskPII(text: string): string {
  if (!text) return '';

  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.***') // Emails
    .replace(/(?:[0-9]{4}-){3}[0-9]{4}/g, '****-****-****-****') // Credit Cards
    .replace(/(?:\b[a-fA-F0-9]{32,}\b)/g, (match) => match.slice(0, 4) + '...' + match.slice(-4)); // Probable hashes/keys
}
