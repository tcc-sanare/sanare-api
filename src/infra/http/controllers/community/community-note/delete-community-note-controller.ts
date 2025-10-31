import { DeleteCommunityNoteUseCase } from "@/domain/community/application/use-cases/community-note/delete-community-note-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { CommunityNotePresenter } from "@/infra/http/presenters/community-note-presenter";
import { Controller, Delete, Param } from "@nestjs/common";

@Controller('community-note')
export class DeleteCommunityNoteController {
  constructor (
    private deleteCommunityNoteUseCase: DeleteCommunityNoteUseCase
  ) {}

  @Delete(':id')
  async handle(
    @Param('id') id: string
  ) {
    const result = await this.deleteCommunityNoteUseCase.execute({
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