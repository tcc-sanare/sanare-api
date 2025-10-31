import { GetCommunityNoteByIdUseCase } from "@/domain/community/application/use-cases/community-note/get-community-note-by-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { CommunityNotePresenter } from "@/infra/http/presenters/community-note-presenter";
import { Controller, Get, Param } from "@nestjs/common";

@Controller('community-note')
export class GetCommunityNoteByIdController {
  constructor (
    private getCommunityNoteIdUseCase: GetCommunityNoteByIdUseCase
  ) {}

  @Get(':id')
  async handle(
    @Param('id') id: string
  ) {
    const result = await this.getCommunityNoteIdUseCase.execute({
      communityNoteId: id
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      communityNote: CommunityNotePresenter.toHttp(result.value.communityNote)
    }
  }
}