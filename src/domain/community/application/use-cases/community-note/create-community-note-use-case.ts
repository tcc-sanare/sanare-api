import { Either, right } from "@/core/either"
import { CommunityNote, RowStatus } from "@/domain/community/enterprise/entities/community-note"
import { CommunityNoteRating } from "@/domain/community/enterprise/entities/community-note-rating"
import { Injectable } from "@nestjs/common"
import { CommunityNoteRepository } from "../../repositories/community-note-repository"

type CreateCommunityNoteUseCaseRequest = {
  cause: string
  userId: string
  postId: string
  status?: RowStatus

  ratings?: CommunityNoteRating[]
}

type CreateCommunityNoteUseCaseResponse = Either<
  null,
  {
    communityNote: CommunityNote
  }
>

@Injectable()
export class CreateCommunityNoteUseCase {
  constructor(private communityNoteRepository: CommunityNoteRepository) {}

  async execute(data: CreateCommunityNoteUseCaseRequest): Promise<CreateCommunityNoteUseCaseResponse> {
    const communityNote = CommunityNote.create({
      cause: data.cause,
      userId: data.userId,
      postId: data.postId,
      status: data.status,
    })
    
    await this.communityNoteRepository.create(communityNote)

    return right({ communityNote })
  }
}