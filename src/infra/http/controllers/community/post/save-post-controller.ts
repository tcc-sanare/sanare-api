import { Account } from "@/domain/account/user/enterprise/entities/account";
import { UpdatePostUseCase } from "@/domain/community/application/use-cases/post/update-post-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { PostPresenter } from "@/infra/http/presenters/post-presenter";
import { Controller, Param, Post, Put, UseGuards } from "@nestjs/common";

@Controller('post-save')
export class SavePostController {
  constructor (
    private updatePostUseCase: UpdatePostUseCase
  ) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  async handle(
    @Param('id') id: string,
    @GetAccount() account: Account
  ) {
    const result = await this.updatePostUseCase.execute({
      postId: id,
      saves: [{ userId: account.id.toString() }]
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      post: PostPresenter.toHttp(result.value.post)
    }
  }
}