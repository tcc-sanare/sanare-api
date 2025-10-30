import { DeletePostUseCase } from "@/domain/community/application/use-cases/post/delete-post-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { PostPresenter } from "@/infra/http/presenters/post-presenter";
import { Controller, Delete, Param } from "@nestjs/common";
import { string } from "zod";

@Controller('post')
export class DeletePostController {
  constructor (
    private deletePostUseCase: DeletePostUseCase
  ) {}

  @Delete(':id')
  async handle(@Param('id') id: string) {
    const result = await this.deletePostUseCase.execute({
      postId: id
    })
    
    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }
    
    return {
        post: PostPresenter.toHttp(result.value.post)
    }
    
  }
}