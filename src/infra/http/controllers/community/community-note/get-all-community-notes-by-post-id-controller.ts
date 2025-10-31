import { GetAllCommunityNotesByPostIdUseCase } from "@/domain/community/application/use-cases/community-note/get-all-community-notes-by-post-id-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { CommunityNotePresenter } from "@/infra/http/presenters/community-note-presenter";
import { Controller, Get, Param } from "@nestjs/common";

@Controller('community-note/post')
export class GetAllCommunityNotesByPostIdController {
  constructor (
    private getAllCommunityNotesByPostIdUseCase: GetAllCommunityNotesByPostIdUseCase
  ) {}

  @Get(':id')
  async handle(
    @Param('id') id: string
  ) {
    const result = await this.getAllCommunityNotesByPostIdUseCase.execute({
      postId: id
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      communityNotes: result.value.communityNotes.map(CommunityNotePresenter.toHttp)
    }
  }
}