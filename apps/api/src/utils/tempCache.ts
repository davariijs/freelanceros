interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

export class TempCache<T> {
  private store = new Map<string, CacheItem<T>>();

  set(key: string, data: T, ttlMinutes: number): void {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    this.store.set(key.toLowerCase(), { data, expiresAt });
  }

  get(key: string): T | null {
    const item = this.store.get(key.toLowerCase());
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.store.delete(key.toLowerCase());
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.store.delete(key.toLowerCase());
  }
}
