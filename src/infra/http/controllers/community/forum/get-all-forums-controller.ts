import { GetAllForumsUseCase } from "@/domain/community/application/use-cases/forum/get-all-forums-use-case"
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception"
import { ForumPresenter } from "@/infra/http/presenters/forum-presenter"
import { Controller, Get, Query } from "@nestjs/common"

@Controller('forum')
export class GetAllForumsController {
  constructor (
    // private getForumByNameUseCase: GetForumByNameUseCase,
    private getAllForumsUseCase: GetAllForumsUseCase
  ) {}

  @Get()
  async handle() {
    const result = await this.getAllForumsUseCase.execute()

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      forums: result.value.forums.map(ForumPresenter.toHttp)
    }
  }
}
