export const cryptoUtils = {
  async encrypt(text: string, secret: string): Promise<string> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: enc.encode("yph-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(text)
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  },

  async decrypt(data: string, secret: string): Promise<string> {
    try {
        const enc = new TextEncoder();
        const dec = new TextDecoder();
        const combined = new Uint8Array(
          atob(data)
            .split("")
            .map((c) => c.charCodeAt(0))
        );

        const iv = combined.slice(0, 12);
        const encrypted = combined.slice(12);

        const keyMaterial = await crypto.subtle.importKey(
          "raw",
          enc.encode(secret),
          { name: "PBKDF2" },
          false,
          ["deriveBits", "deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: enc.encode("yph-salt"),
            iterations: 100000,
            hash: "SHA-256",
          },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
        );

        const decrypted = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          key,
          encrypted
        );

        return dec.decode(decrypted);
    } catch {
        return "";
    }
  }
};
