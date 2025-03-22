import { Storage } from '@/domain/application/storage';
import { Blob } from 'buffer';
import { randomUUID } from 'crypto';

interface StorageParams {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

export class InMemoryStorage implements Storage {
  items: {
    fileKey: string;
    file: Blob;
  }[];
  constructor() {
    this.items = [];
  }

  async upload(params: StorageParams): Promise<{ fileKey: string }> {
    const fileKey = `${randomUUID()}-${params.fileName}`;

    this.items.push({
      fileKey,
      file: new Blob([params.buffer], { type: params.fileType }),
    });

    return { fileKey };
  }
  async delete(fileKey: string): Promise<void> {
    const file = this.items.find((item) => item.fileKey === fileKey);

    if (!file) {
      throw new Error('Image not found');
    }

    this.items = this.items.filter((item) => item.fileKey !== fileKey);

    return;
  }
  async getSignedUrl(fileKey: string): Promise<{ url: string }> {
    const file = this.items.find((item) => item.fileKey === fileKey);

    if (!file) {
      throw new Error('Image not found');
    }

    const base64Data = Buffer.from(await file.file.arrayBuffer()).toString(
      'base64',
    );
    const mimeType = file.file.type || 'application/octet-stream';
    return { url: `data:${mimeType};base64,${base64Data}` };
  }
}
