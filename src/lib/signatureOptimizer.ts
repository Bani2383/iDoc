export class SignatureOptimizer {
  static compressSignature(dataUrl: string, quality: number = 0.8): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;

    const img = new Image();
    img.src = dataUrl;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL('image/png', quality);
  }

  static async optimizeSignatureSize(dataUrl: string, maxWidth: number = 800): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const optimized = canvas.toDataURL('image/png', 0.85);
        resolve(optimized);
      };

      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  static trimSignature(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    let top = height;
    let bottom = 0;
    let left = width;
    let right = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 0) {
          if (y < top) top = y;
          if (y > bottom) bottom = y;
          if (x < left) left = x;
          if (x > right) right = x;
        }
      }
    }

    const trimWidth = right - left + 1;
    const trimHeight = bottom - top + 1;

    const trimmedCanvas = document.createElement('canvas');
    const trimmedCtx = trimmedCanvas.getContext('2d');
    if (!trimmedCtx) return canvas;

    trimmedCanvas.width = trimWidth;
    trimmedCanvas.height = trimHeight;

    const trimmedData = ctx.getImageData(left, top, trimWidth, trimHeight);
    trimmedCtx.putImageData(trimmedData, 0, 0);

    return trimmedCanvas;
  }

  static createSignatureCache(dataUrl: string): void {
    try {
      const cacheKey = 'signature_cache';
      const cache = {
        data: dataUrl,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to cache signature');
    }
  }

  static getSignatureFromCache(): string | null {
    try {
      const cacheKey = 'signature_cache';
      const cached = sessionStorage.getItem(cacheKey);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > 30 * 60 * 1000) {
        sessionStorage.removeItem(cacheKey);
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  static clearSignatureCache(): void {
    try {
      sessionStorage.removeItem('signature_cache');
    } catch (error) {
      console.warn('Failed to clear signature cache');
    }
  }
}
