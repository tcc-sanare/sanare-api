import { CreateForumUseCase } from "@/domain/community/application/use-cases/forum/create-forum-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { ForumPresenter } from "@/infra/http/presenters/forum-presenter";
import { Body, Controller, Post } from "@nestjs/common";
import z from "zod";

const createForumBodySchema = z.object({
  body: z.string(),
  link: z.string()
})

type BodyDto = z.infer<typeof createForumBodySchema>

const bodyValidation = new ZodValidationPipe(createForumBodySchema)

@Controller('forum')
export class CreateForumController {
  constructor (
    private createForumUseCase: CreateForumUseCase
  ) {}

  @Post()
  async handle (
    @Body(bodyValidation) data: BodyDto
  ) {
    const result = await this.createForumUseCase.execute({
      body: data.body,
      link: data.link
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      forum: ForumPresenter.toHttp(result.value.forum)
    }
  }
}