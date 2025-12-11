// Offline manager for PWA functionality

interface PendingDocument {
  id: string;
  template: string;
  data: Record<string, any>;
  timestamp: number;
}

class OfflineManager {
  private dbName = 'idoc-offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('pending-docs')) {
          db.createObjectStore('pending-docs', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('cached-templates')) {
          db.createObjectStore('cached-templates', { keyPath: 'slug' });
        }

        if (!db.objectStoreNames.contains('user-preferences')) {
          db.createObjectStore('user-preferences', { keyPath: 'key' });
        }
      };
    });
  }

  async savePendingDocument(document: Omit<PendingDocument, 'id' | 'timestamp'>) {
    await this.ensureDB();

    const doc: PendingDocument = {
      ...document,
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    return new Promise<string>((resolve, reject) => {
      const tx = this.db!.transaction('pending-docs', 'readwrite');
      const store = tx.objectStore('pending-docs');
      const request = store.add(doc);

      request.onsuccess = () => resolve(doc.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingDocuments(): Promise<PendingDocument[]> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('pending-docs', 'readonly');
      const store = tx.objectStore('pending-docs');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deletePendingDocument(id: string) {
    await this.ensureDB();

    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction('pending-docs', 'readwrite');
      const store = tx.objectStore('pending-docs');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async cacheTemplate(template: any) {
    await this.ensureDB();

    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction('cached-templates', 'readwrite');
      const store = tx.objectStore('cached-templates');
      const request = store.put(template);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedTemplate(slug: string) {
    await this.ensureDB();

    return new Promise<any>((resolve, reject) => {
      const tx = this.db!.transaction('cached-templates', 'readonly');
      const store = tx.objectStore('cached-templates');
      const request = store.get(slug);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async savePreference(key: string, value: any) {
    await this.ensureDB();

    return new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction('user-preferences', 'readwrite');
      const store = tx.objectStore('user-preferences');
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPreference(key: string) {
    await this.ensureDB();

    return new Promise<any>((resolve, reject) => {
      const tx = this.db!.transaction('user-preferences', 'readonly');
      const store = tx.objectStore('user-preferences');
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  async syncWhenOnline() {
    if (!this.isOnline()) {
      console.log('[OfflineManager] Waiting for network connection...');
      return;
    }

    const pendingDocs = await this.getPendingDocuments();
    console.log(`[OfflineManager] Syncing ${pendingDocs.length} pending documents`);

    for (const doc of pendingDocs) {
      try {
        // Attempt to sync with server
        // This would call your actual API
        console.log('[OfflineManager] Syncing document:', doc.id);

        // After successful sync, delete from pending
        await this.deletePendingDocument(doc.id);
      } catch (error) {
        console.error('[OfflineManager] Failed to sync document:', error);
      }
    }
  }

  private async ensureDB() {
    if (!this.db) {
      await this.init();
    }
  }
}

export const offlineManager = new OfflineManager();

// Initialize on load
if (typeof window !== 'undefined') {
  offlineManager.init().catch(console.error);

  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('[OfflineManager] Back online, syncing...');
    offlineManager.syncWhenOnline();
  });

  window.addEventListener('offline', () => {
    console.log('[OfflineManager] Gone offline');
  });
}
