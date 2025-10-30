import { Account } from "@/domain/account/user/enterprise/entities/account";
import { UpdateCommunityNoteUseCase } from "@/domain/community/application/use-cases/community-note/update-community-note-use-case";
import { GetAccount } from "@/infra/http/decorators/get-account";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { AuthGuard } from "@/infra/http/guards/auth-guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CommunityNotePresenter } from "@/infra/http/presenters/community-note-presenter";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { retry } from "rxjs";
import z from "zod";

const rateCommunityNoteBodySchema = z.object({
  communityNoteId: z.string(),
  rating: z.enum(['YES', 'SOMEWHAT', 'NO'])
})

type RateCommunityNoteDto = z.infer<typeof rateCommunityNoteBodySchema>
const bodyValidation = new ZodValidationPipe(rateCommunityNoteBodySchema)

@Controller('community-note/rate')
export class RateCommunityNoteController {
  constructor(
    private updateCommunityNoteUseCase: UpdateCommunityNoteUseCase
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async handle(
    @GetAccount() account: Account,
    @Body(bodyValidation) data: RateCommunityNoteDto
  ) {
    const result = await this.updateCommunityNoteUseCase.execute({
      communityNoteId: data.communityNoteId,
      ratings: [{
        userId: account.id.toString(),
        rating: data.rating
      }]
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      communityNote: CommunityNotePresenter.toHttp(result.value.communityNote)
    }
  }
}