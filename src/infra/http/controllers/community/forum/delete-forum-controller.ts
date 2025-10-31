import { DeleteForumUseCase } from "@/domain/community/application/use-cases/forum/delete-forum-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ForumPresenter } from "@/infra/http/presenters/forum-presenter";
import { Controller, Delete, Param } from "@nestjs/common";

@Controller('forum')
export class DeleteForumController {
  constructor (
    private deleteForumUseCase: DeleteForumUseCase
  ) {}

  @Delete(':id')
  async handle(@Param('id') id: string) {
    const result = await this.deleteForumUseCase.execute({
      forumId: id
    })
    
    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      deletedForum: ForumPresenter.toHttp(result.value.forum)
    }
  }
}