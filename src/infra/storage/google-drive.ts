import { StoragedFile } from "@/core/entities/storaged-file";
import { Storage } from "@/domain/application/storage";
import { Injectable } from "@nestjs/common";
import { google } from "googleapis";
import * as path from "node:path";
import { Readable } from "node:stream";
import { EnvService } from "../env/env.service";

const GOOGLE_DRIVE_FOLDER = "1lSIoIMpH11F_I2FU3nQbOWXfZmKj7OfJ";

@Injectable()
export class GoogleDrive implements Storage {
  constructor (
    private envService: EnvService
  ) {}

  async upload(params: { fileName: string; fileType: string; buffer: Buffer; }): Promise<StoragedFile> {
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

    return new StoragedFile(response.data.id, this)
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
    const oAuth2Client = new google.auth.OAuth2(
      this.envService.get('GOOGLE_DRIVE_CLIENT_ID'),
      this.envService.get('GOOGLE_DRIVE_CLIENT_SECRET'),
      this.envService.get('GOOGLE_DRIVE_REDIRECT_URI')
    );

    oAuth2Client.setCredentials({ refresh_token: this.envService.get('GOOGLE_DRIVE_REFRESH_TOKEN') });

    const ACCESS_TOKEN = await oAuth2Client.getAccessToken();

    if (!ACCESS_TOKEN) {
      throw new Error("Failed to get access token from Google Drive");
    }

    return oAuth2Client;
  }

  private async getService() {
    return google.drive({
      version: 'v3',
      auth: await this.getAuth()
    });
  }
}