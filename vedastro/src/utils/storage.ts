/* eslint-disable @typescript-eslint/no-explicit-any */
export const storage = {
  set: (key: string, data: any): void => {
    if (typeof window === "undefined") return;
    try {
      const payload = typeof data === "string" ? data : JSON.stringify(data);
      window.localStorage.setItem(key, payload);
    } catch (err) {
      console.error("Localstorage write tracking failure context:", err);
    }
  },

  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return null;
      
      // Attempt generic parsing if it looks like a clean JSON object structure array
      if (item.startsWith("{") || item.startsWith("[")) {
        return JSON.parse(item) as T;
      }
      return item as unknown as T;
    } catch (err) {
      console.error("Localstorage read verification fault loop:", err);
      return null;
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },

  clearAll: (): void => {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
  }
};