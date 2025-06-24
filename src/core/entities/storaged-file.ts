import { Storage } from "@/domain/application/storage";

export class StoragedFile {
  private fileKey: string;
  private storage: Storage;

  get key(): string {
    return this.fileKey;
  }

  async getSignedUrl(): Promise<string> {
    const response = await this.storage.getSignedUrl(this.fileKey);
    return response.url;
  }

  constructor(fileKey: string, storage: Storage) {
    this.fileKey = fileKey;
    this.storage = storage;
  }

  async delete(): Promise<void> {
    await this.storage.delete(this.fileKey);
  }
}