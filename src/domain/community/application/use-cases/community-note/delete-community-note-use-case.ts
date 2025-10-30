import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note"
import { Injectable } from "@nestjs/common"
import { CommunityNoteRepository } from "../../repositories/community-note-repository"

type DeleteCommunityNoteUseCaseRequest = {
  communityNoteId: string
}

type DeleteCommunityNoteUseCaseResponse = Either<
  NotAllowedError<DeleteCommunityNoteUseCaseRequest>,
  {
    communityNote: CommunityNote
  }
>

@Injectable()
export class DeleteCommunityNoteUseCase {
  constructor(private communityNoteRepository: CommunityNoteRepository) {}
  
  async execute(data: DeleteCommunityNoteUseCaseRequest): Promise<DeleteCommunityNoteUseCaseResponse> {
    const communityNote = await this.communityNoteRepository.findById(data.communityNoteId)

    if (!communityNote) {
      return left(
        new NotAllowedError<DeleteCommunityNoteUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Nota de Comunidade não encontrada'
            }
          ]
        })
      )
    }

    await this.communityNoteRepository.delete(communityNote)

    communityNote.status = "DELETED"

    return right({ communityNote })
  }
}