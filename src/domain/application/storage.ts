import { StoragedFile } from "@/core/entities/storaged-file";

interface StorageParams {
  fileName: string;
  fileType: string;
  buffer: Buffer;
}

export abstract class Storage {
  abstract upload(params: StorageParams): Promise<StoragedFile>;

  abstract delete(fileKey: string): Promise<void>;

  abstract getSignedUrl(fileKey: string): { url: string };
}
