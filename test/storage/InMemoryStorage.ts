import { Storage } from '@/domain/application/storage/Storage';
import { Blob } from 'buffer';
import { randomUUID } from 'crypto';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';

interface StorageParams {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

export class InMemoryStorage implements Storage {
  async upload(params: StorageParams): Promise<{ fileKey: string }> {
    const fileKey = `${randomUUID()}-${params.fileName}`;

    writeFileSync(`./test/storage/items/${fileKey}`, params.buffer);

    return { fileKey };
  }
  async delete(fileKey: string): Promise<void> {
    const path = `./test/storage/items/${fileKey}`;
    if (!existsSync(path)) {
      throw new Error('Image not found');
    }

    unlinkSync(path);
  }
  async getSignedUrl(fileKey: string): Promise<{ url: string }> {
    const path = `./test/storage/items/${fileKey}`;

    if (!existsSync(path)) {
      throw new Error('Image not found');
    }
    const fileBuffer = readFileSync(path);

    const file = new Blob([fileBuffer]);

    return { url: URL.createObjectURL(file) };
  }
}
