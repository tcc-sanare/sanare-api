import { UpdatePostUseCase } from "@/domain/community/application/use-cases/post/update-post-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PostPresenter } from "@/infra/http/presenters/post-presenter";
import { Body, Controller, Param, Put } from "@nestjs/common";
import z from "zod";

const updatePostBodySchema = z.object({
  body: z.string(),
  status: z.enum(['ACTIVED', 'DELETED'])
})

type UpdatePostDto = z.infer<typeof updatePostBodySchema>

const bodyValidation = new ZodValidationPipe(updatePostBodySchema)

@Controller('post')
export class UpdatePostController {
  constructor (
    private updatePostUseCase: UpdatePostUseCase
  ) {}

  @Put(':id') 
  async handle(
    @Param('id') id: string,
    @Body(bodyValidation) data : UpdatePostDto
  ) {
    const result = await this.updatePostUseCase.execute({
      postId: id,
      body: data.body,
      status: data.status
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      post: PostPresenter.toHttp(result.value.post)
    }
  }
}