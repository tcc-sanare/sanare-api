import { Account } from "@/domain/account/user/enterprise/entities/account";
import { CreateCommunityNoteUseCase } from "@/domain/community/application/use-cases/community-note/create-community-note-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CommunityNotePresenter } from "@/infra/http/presenters/community-note-presenter";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import z, { string } from "zod";

const createCommunityNoteBodySchema = z.object({
  cause: z.string().min(10).max(600),
  postId: z.string(),

})

type BodyDto = z.infer<typeof createCommunityNoteBodySchema>
const bodyValidation = new ZodValidationPipe(createCommunityNoteBodySchema)

@Controller('community-note')
export class CreateCommunityNoteController {
  constructor (
    private createCommunityNoteUseCase: CreateCommunityNoteUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async handle (
    @Body(bodyValidation) data: BodyDto,
    @GetAccount() account: Account
  ) {
    const result = await this.createCommunityNoteUseCase.execute({
      cause: data.cause,
      userId: account.id.toString(),
      postId: data.postId
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      communityNote: CommunityNotePresenter.toHttp(result.value.communityNote)
    }
  }
}