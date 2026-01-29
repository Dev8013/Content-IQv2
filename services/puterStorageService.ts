
import { HistoryItem } from '../types';

declare const puter: any;

const STORAGE_KEY = 'content_iq_history_v2';

export class PuterStorageService {
  static async saveHistory(history: HistoryItem[]): Promise<void> {
    if (!await puter.auth.isSignedIn()) return;
    await puter.kv.set(STORAGE_KEY, JSON.stringify(history));
  }

  static async getHistory(): Promise<HistoryItem[]> {
    if (!await puter.auth.isSignedIn()) return [];
    const data = await puter.kv.get(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static async clearHistory(): Promise<void> {
    if (!await puter.auth.isSignedIn()) return;
    await puter.kv.del(STORAGE_KEY);
  }
}
