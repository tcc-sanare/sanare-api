import { GetPostByIdUseCase } from "@/domain/community/application/use-cases/post/get-post-by-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { PostPresenter } from "@/infra/http/presenters/post-presenter";
import { Controller, Get, Param } from "@nestjs/common";

@Controller('post')
export class GetPostByIdController {
  constructor (
    private getPostByIdUseCase: GetPostByIdUseCase
  ) {}

  @Get(':id')
  async handle(@Param('id') id: string) {
    const result = await this.getPostByIdUseCase.execute({
      postId: id
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }
    console.log(result.value.post)
    return {
      post: PostPresenter.toHttp(result.value.post)
    }
  }
}