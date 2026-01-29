
import { HistoryItem } from '../types';

/**
 * World-class Drive Service for Neural Storage.
 * Handles the abstraction between local state and Google Drive persistence.
 */

const FOLDER_NAME = 'ContentIQ_Archive';

export class GoogleDriveService {
  private static accessToken: string | null = null;

  static setToken(token: string) {
    this.accessToken = token;
  }

  // Detect if the current token is a mock simulation token
  private static isMock(): boolean {
    return !this.accessToken || this.accessToken.startsWith('G-DRIVE-AUTH-');
  }

  static async syncToDrive(item: HistoryItem) {
    if (this.isMock()) {
      console.log(`[Neural Sync Simulator] Item ${item.id} logged locally. Real Drive Sync requires production OAuth ClientID.`);
      return;
    }

    try {
      const folderId = await this.getOrCreateFolder();
      
      const fileMetadata = {
        name: `CIQ_LOG_${item.id}.json`,
        parents: [folderId],
        mimeType: 'application/json'
      };

      const fileContent = JSON.stringify(item);
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      const multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(fileMetadata) +
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          fileContent +
          close_delim;

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Drive Upload Failed: ${err.error?.message || response.statusText}`);
      }
      
      console.log(`[Neural Sync] Log ${item.id} persisted to Google Drive.`);
    } catch (error) {
      console.warn('[Drive Service Sync Interrupted]', error);
    }
  }

  private static async getOrCreateFolder(): Promise<string> {
    if (this.isMock()) return "mock-folder-id";

    const query = `name = '${FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${this.accessToken}` }
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Folder Query Failed: ${err.error?.message || response.statusText}`);
    }
    const data = await response.json();

    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }

    const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder'
      })
    });
    
    if (!createResponse.ok) throw new Error("Could not create archive folder in Drive.");
    const folder = await createResponse.json();
    return folder.id;
  }

  static async fetchHistoryFromDrive(): Promise<HistoryItem[]> {
    if (this.isMock()) return [];
    
    try {
      const folderId = await this.getOrCreateFolder();
      const query = `'${folderId}' in parents and trashed = false`;
      const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id, name)&pageSize=50`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      
      if (!response.ok) return [];
      const data = await response.json();
      
      const files = data.files || [];
      const results = await Promise.allSettled(
        files.filter((f: any) => f.name.startsWith('CIQ_LOG_')).map(async (file: any) => {
          const contentResp = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
            headers: { 'Authorization': `Bearer ${this.accessToken}` }
          });
          if (!contentResp.ok) throw new Error("File inaccessible");
          return await contentResp.json();
        })
      );

      const history: HistoryItem[] = [];
      results.forEach((res) => {
        if (res.status === 'fulfilled') history.push(res.value);
      });

      return history.sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.warn("[Drive Fetch Suspended]", e);
      return [];
    }
  }
}
