import { Account } from "@/domain/account/user/enterprise/entities/account";
import { UpdateForumUseCase } from "@/domain/community/application/use-cases/forum/update-forum-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ForumPresenter } from "@/infra/http/presenters/forum-presenter";
import { Controller, Param, Post, Put, UseGuards } from "@nestjs/common";

@Controller('forum/save')
export class SaveForumController {
  constructor (
    private updateForumUseCase: UpdateForumUseCase
  ) {}

  @Post(':id')
  @UseGuards(AuthGuard)
  async handle(
    @Param('id') id: string,
    @GetAccount() account: Account
  ) {
    const result = await this.updateForumUseCase.execute({
      forumId: id,
      saves: [{ userId: account.id.toString() }]
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      post: ForumPresenter.toHttp(result.value.forum)
    }
  }
}