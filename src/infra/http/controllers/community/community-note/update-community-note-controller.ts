import { UpdateCommunityNoteUseCase } from "@/domain/community/application/use-cases/community-note/update-community-note-use-case";
import { CustomHttpException } from "@/infra/http/exceptions/custom-http-exception";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CommunityNotePresenter } from "@/infra/http/presenters/community-note-presenter";
import { Body, Controller, Param, Put } from "@nestjs/common";
import z from "zod";

const updateCommunityNoteBodySchema = z.object({
  cause: z.string(),
})

type UpdateCommunityNoteDto = z.infer<typeof updateCommunityNoteBodySchema>

const bodyValidation= new ZodValidationPipe(updateCommunityNoteBodySchema)

@Controller('community-note')
export class UpdateCommunityNoteController {
  constructor (
    private updateCommunityNoteUseCase: UpdateCommunityNoteUseCase
  ) {}

  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body(bodyValidation) data: UpdateCommunityNoteDto
  ) {
    const result = await this.updateCommunityNoteUseCase.execute({
      communityNoteId: id,
      cause: data.cause
    })

    if (result.isLeft()) {
      throw new CustomHttpException(result.value)
    }

    return {
      communityNote: CommunityNotePresenter.toHttp(result.value.communityNote)
    }
  }
}