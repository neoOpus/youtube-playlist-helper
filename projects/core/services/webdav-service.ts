/**
 * Service for WebDAV synchronization (Initial Scaffolding).
 */
export const webdavService = {
  async testConnection(url: string, user: string, pass: string): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: "PROPFIND",
        headers: {
          Authorization: "Basic " + btoa(user + ":" + pass),
          Depth: "0",
        },
      });
      return response.ok;
    } catch (error) {
      console.error("WebDAV connection failed:", error);
      return false;
    }
  },

  async uploadData(url: string, user: string, pass: string, data: any): Promise<boolean> {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: "Basic " + btoa(user + ":" + pass),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response.ok;
    } catch (error) {
        console.error("WebDAV upload failed:", error);
        return false;
    }
  }
};
