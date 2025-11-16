interface DownloadTask {
  id: string;
  url: string;
  filename: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  error?: string;
}

class DownloadManager {
  private tasks: Map<string, DownloadTask> = new Map();
  private listeners: Set<(tasks: DownloadTask[]) => void> = new Set();

  async download(blob: Blob, filename: string): Promise<void> {
    const taskId = this.generateId();
    const url = URL.createObjectURL(blob);

    const task: DownloadTask = {
      id: taskId,
      url,
      filename,
      progress: 0,
      status: 'pending',
    };

    this.tasks.set(taskId, task);
    this.notifyListeners();

    try {
      task.status = 'downloading';
      this.notifyListeners();

      await this.performDownload(url, filename);

      task.progress = 100;
      task.status = 'completed';
      this.notifyListeners();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        this.tasks.delete(taskId);
        this.notifyListeners();
      }, 3000);
    } catch (error) {
      task.status = 'error';
      task.error = error instanceof Error ? error.message : 'Download failed';
      this.notifyListeners();

      setTimeout(() => {
        URL.revokeObjectURL(url);
        this.tasks.delete(taskId);
        this.notifyListeners();
      }, 5000);
    }
  }

  private performDownload(url: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);

        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          resolve();
        }, 100);
      } catch (error) {
        reject(error);
      }
    });
  }

  async downloadMultiple(items: Array<{ blob: Blob; filename: string }>): Promise<void> {
    const downloads = items.map(item => this.download(item.blob, item.filename));
    await Promise.all(downloads);
  }

  subscribe(listener: (tasks: DownloadTask[]) => void): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const tasks = Array.from(this.tasks.values());
    this.listeners.forEach(listener => listener(tasks));
  }

  private generateId(): string {
    return `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getTasks(): DownloadTask[] {
    return Array.from(this.tasks.values());
  }

  clearCompleted(): void {
    Array.from(this.tasks.entries()).forEach(([id, task]) => {
      if (task.status === 'completed') {
        URL.revokeObjectURL(task.url);
        this.tasks.delete(id);
      }
    });
    this.notifyListeners();
  }
}

export const downloadManager = new DownloadManager();
export type { DownloadTask };
