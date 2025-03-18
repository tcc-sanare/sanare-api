interface StorageParams {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

export abstract class Storage {
  abstract upload(params: StorageParams): Promise<{ fileKey: string }>;

  abstract delete(fileKey: string): Promise<void>;

  abstract getSignedUrl(fileKey: string): Promise<{ url: string }>;
}
