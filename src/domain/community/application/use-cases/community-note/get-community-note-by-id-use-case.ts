import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note"
import { Injectable } from "@nestjs/common"
import { CommunityNoteRepository } from "../../repositories/community-note-repository"

type GetCommunityNoteByIdUseCaseRequest = {
  communityNoteId: string
}

type GetCommunityNoteByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetCommunityNoteByIdUseCaseRequest>,
  {
    communityNote: CommunityNote
  }
>

@Injectable()
export class GetCommunityNoteByIdUseCase {
  constructor(private communityNoteRepository: CommunityNoteRepository) {}

  async execute(data: GetCommunityNoteByIdUseCaseRequest): Promise<GetCommunityNoteByIdUseCaseResponse> {
    const communityNote = await this.communityNoteRepository.findById(data.communityNoteId)

    if (!communityNote) {
      return left(
        new ResourceNotFoundError<GetCommunityNoteByIdUseCaseRequest>({
          errors: [
            {
              message: 'Nota da Comunidade não encontrada'
            }
          ]
        })
      )
    }

    return right({ communityNote })
  }
}