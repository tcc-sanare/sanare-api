import { Storage } from "@/domain/application/storage";
import { google } from "googleapis";
import { Readable } from "node:stream";

const GOOGLE_DRIVE_FOLDER = "1lSIoIMpH11F_I2FU3nQbOWXfZmKj7OfJ";

export class GoogleDrive implements Storage {
  async upload(params: { fileName: string; fileType: string; buffer: Buffer; }): Promise<{ fileKey: string; }> {
    const service = await this.getService();

    const bufferStream = new Readable();
    bufferStream.push(params.buffer);
    bufferStream.push(null);

    const response = await service.files.create({
      media: {
        body: bufferStream,
        mimeType: params.fileType
      },
      requestBody: {
        name: params.fileName,
        parents: [GOOGLE_DRIVE_FOLDER],
      }
    });

    if (!response.data.id) {
      throw Error("Erro no upload")
    }

    return { fileKey: response.data.id };
  }

  async getSignedUrl(key: string): Promise<{ url: string; }> {
    const service = await this.getService();

    const file = await service.files.get({
      fileId: key,
      alt: 'media'
    });

    const blob = file.data as unknown as Blob;

    console.log(file.headers)

    return { url: `data:${file.headers['content-type']};base64,${Buffer.from(await blob.arrayBuffer()).toString("base64")} `}
  }

  async delete(key: string): Promise<void> {
    const service = await this.getService();

    await service.files.delete({
      fileId: key
    });
  }

  private async getAuth () {
    return new google.auth.GoogleAuth({
      keyFile: '../../../google-drive-credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive']
    });
  }

  private async getService() {
    return google.drive({
      version: 'v3',
      auth: await this.getAuth()
    });
  }
}