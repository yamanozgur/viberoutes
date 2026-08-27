// Google Drive & Google Docs Integration Service for Vibe Routes

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

export interface GoogleDocContent {
  id: string;
  title: string;
  paragraphs: string[];
  rawText: string;
}

const STORAGE_KEY = 'viberoutes_google_access_token';
const CLIENT_ID = '157679457512-apps.googleusercontent.com'; // configured via set_up_oauth
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/documents.readonly';

export class GoogleDriveService {
  private static token: string | null = null;

  public static getStoredToken(): string | null {
    if (this.token) return this.token;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) {
          this.token = parsed.token;
          return this.token;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // ignore
    }
    return null;
  }

  public static setStoredToken(token: string, expiresInSeconds: number = 3599) {
    this.token = token;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token,
          expiresAt: Date.now() + expiresInSeconds * 1000,
        })
      );
    } catch (e) {
      console.warn('Could not store OAuth token:', e);
    }
  }

  public static logout() {
    this.token = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  public static isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  /**
   * Initializes Google Identity Services (GSI) token client to request token from user
   */
  public static async authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check if google gsi script is loaded
      if (typeof window === 'undefined' || !(window as any).google?.accounts?.oauth2) {
        // Dynamically load Google GSI script if not present
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          this.requestAccessToken(resolve, reject);
        };
        script.onerror = () => {
          reject(new Error('Failed to load Google Identity Services library.'));
        };
        document.head.appendChild(script);
      } else {
        this.requestAccessToken(resolve, reject);
      }
    });
  }

  private static requestAccessToken(resolve: (token: string) => void, reject: (err: any) => void) {
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }
          if (response.access_token) {
            this.setStoredToken(response.access_token, response.expires_in || 3600);
            resolve(response.access_token);
          } else {
            reject(new Error('No access token received from Google.'));
          }
        },
      });
      client.requestAccessToken({ prompt: 'consent' });
    } catch (err) {
      reject(err);
    }
  }

  /**
   * List folders in the user's Google Drive
   */
  public static async listFolders(parentFolderId: string | null = null): Promise<DriveFile[]> {
    const token = this.getStoredToken();
    if (!token) throw new Error('Not authenticated with Google');

    const query = parentFolderId
      ? `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      : `'root' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;

    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,mimeType,modifiedTime,webViewLink)&orderBy=name`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        this.logout();
        throw new Error('Authentication expired. Please sign in with Google again.');
      }
      throw new Error(`Google Drive API error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.files || [];
  }

  /**
   * List Google Docs in a folder or root
   */
  public static async listDocuments(parentFolderId: string | null = null): Promise<DriveFile[]> {
    const token = this.getStoredToken();
    if (!token) throw new Error('Not authenticated with Google');

    const query = parentFolderId
      ? `'${parentFolderId}' in parents and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain') and trashed = false`
      : `mimeType = 'application/vnd.google-apps.document' and trashed = false`;

    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,mimeType,modifiedTime,webViewLink,iconLink)&orderBy=modifiedTime desc&pageSize=30`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        this.logout();
        throw new Error('Authentication expired. Please sign in with Google again.');
      }
      throw new Error(`Google Drive API error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.files || [];
  }

  /**
   * Fetch structured content from a Google Doc using Google Docs API v1
   */
  public static async getDocument(docId: string): Promise<GoogleDocContent> {
    const token = this.getStoredToken();
    if (!token) throw new Error('Not authenticated with Google');

    const url = `https://docs.googleapis.com/v1/documents/${docId}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Google Docs API error: ${res.statusText}`);
    }

    const doc = await res.json();
    const title = doc.title || 'Untitled Article';
    const paragraphs: string[] = [];

    if (doc.body && doc.body.content) {
      for (const element of doc.body.content) {
        if (element.paragraph && element.paragraph.elements) {
          let paragraphText = '';
          for (const pe of element.paragraph.elements) {
            if (pe.textRun && pe.textRun.content) {
              paragraphText += pe.textRun.content;
            }
          }
          const trimmed = paragraphText.trim();
          if (trimmed.length > 0) {
            paragraphs.push(trimmed);
          }
        }
      }
    }

    return {
      id: docId,
      title,
      paragraphs,
      rawText: paragraphs.join('\n\n'),
    };
  }
}
