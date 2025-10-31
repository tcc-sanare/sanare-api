import { GetForumByIdUseCase } from "@/domain/community/application/use-cases/forum/get-forum-by-id-use-case";
import { GetPostsByForumIdUseCase } from "@/domain/community/application/use-cases/post/get-posts-by-forum-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ForumPresenter } from "@/infra/http/presenters/forum-presenter";
import { Controller, Get, Param } from "@nestjs/common";

@Controller('forum')
export class GetForumByIdController {
  constructor (
    private getForumByIdUseCase: GetForumByIdUseCase,
    private getPostsByForumIdUseCase: GetPostsByForumIdUseCase
  ) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const result = await this.getForumByIdUseCase.execute({
      forumId: id
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    const posts = await this.getPostsByForumIdUseCase.execute({
      forumId: result.value.forum.id.toString()
    })

    if (posts.isLeft()) {
      throw new CustomHttpException(posts.value)
    }
    
    result.value.forum.posts = posts.value.posts

    return {
      forum: ForumPresenter.toHttp(result.value.forum)
    }
  }
}