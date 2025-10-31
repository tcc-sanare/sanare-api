import { Account } from "@/domain/account/user/enterprise/entities/account";
import { CreatePostUseCase } from "@/domain/community/application/use-cases/post/create-post-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PostPresenter } from "@/infra/http/presenters/post-presenter";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import z from "zod";

const createPostBodySchema = z.object({
  body: z.string().min(1).max(600),
  parentId: z.string().optional(),
  forumId: z.string(),
})

type CreaetePostDto = z.infer<typeof createPostBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createPostBodySchema);

@Controller('post')
export class CreatePostController { 
  constructor(
    private createPostUseCase: CreatePostUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async handle (
    @Body(bodyValidationPipe) {
      body,
      parentId,
      forumId
    }: CreaetePostDto,
    @GetAccount() account: Account
  ) {
    const result = await this.createPostUseCase.execute({
      body,
      userId: account.id.toString(),
      parentId,
      forumId
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      post: PostPresenter.toHttp(result.value.post)
    }
  }
}