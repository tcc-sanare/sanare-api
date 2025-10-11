import { Controller, Get, Param, Res } from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { GoogleDrive } from "@/infra/storage/google-drive";
import { Response } from "express";
import { PassThrough } from "stream";

const paramSchema = z.object({
  fileKey: z.string()
});

type ParamDto = z.infer<typeof paramSchema>;
const paramValidation = new ZodValidationPipe(paramSchema);

@Controller("files/:fileKey")
export class GetFileController {
  constructor (
    private googleDrive: GoogleDrive
  ) {}

  @Get()
  async handle(
    @Param(paramValidation) { fileKey }: ParamDto,
    @Res() res: Response
  ) {

    const file = await this.googleDrive.getFile(fileKey);
    res.setHeader('Content-Type', file.metadata.data.mimeType || 'application/octet-stream'); // ou o tipo real do arquivo
    res.setHeader('Content-Disposition', `attachment; filename="${file.metadata.data.name || 'file.pdf'}"`);

    const passThrough = new PassThrough();
    file.data.pipe(passThrough).pipe(res);
  }
}