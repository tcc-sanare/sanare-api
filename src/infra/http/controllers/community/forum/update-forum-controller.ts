import { UseCaseError } from "@/core/errors/use-case-error";
import { UpdateForumUseCase } from "@/domain/community/application/use-cases/forum/update-forum-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ForumPresenter } from "@/infra/http/presenters/forum-presenter";
import { Body, Controller, FileTypeValidator, Param, ParseFilePipe, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import z from "zod";

const updateForumBodySchema = z.object({
  body: z.string().optional(),
  link: z.string()
})

type BodyDto = z.infer<typeof updateForumBodySchema>

const bodyValidation = new ZodValidationPipe(updateForumBodySchema)

@Controller('forum')
export class UpdateForumController {
  constructor (
    private updateForumUseCase: UpdateForumUseCase
  ) {}

  @Put(':id')
  @UseInterceptors(FileInterceptor('photo'))
  async handle(
    @Param('id') id: string,
    @Body(bodyValidation) data: BodyDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        exceptionFactory: () => new CustomHttpException(new UseCaseError ({
          statusCode: 400,
          errors: [
            {
              message: 'Tipo de arquivo inválido. O arquivo deve ser uma imagem.',
              path: ['photo']
            }
          ]
        })),
        validators: [
          new FileTypeValidator({
            fileType: 'image/*'
          })
        ]
      })
    ) photo?: Express.Multer.File
  ) {
    const result = await this.updateForumUseCase.execute({
      forumId: id,
      body: data.body,
      link: data.link,
      imageKey: photo ? {
        fileName: photo.originalname,
        fileType: photo.mimetype,
        buffer: photo.buffer,
      } : null
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      forum: ForumPresenter.toHttp(result.value.forum)
    }
  }
}