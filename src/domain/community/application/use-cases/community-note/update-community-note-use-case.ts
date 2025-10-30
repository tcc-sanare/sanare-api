import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { CommunityNote, RowStatus } from "@/domain/community/enterprise/entities/community-note"
import { CommunityNoteRating } from "@/domain/community/enterprise/entities/community-note-rating"
import { CommunityNoteRepository } from "../../repositories/community-note-repository"
import { Injectable } from "@nestjs/common"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

type UpdateCommunityNoteUseCaseRequest = {
  communityNoteId: string
  cause?: string
  status?: RowStatus

  ratings?: {
    userId: string
    rating: 'YES' | 'SOMEWHAT' | 'NO'
  }[]
}

type UpdateCommunityNoteUseCaseResponse = Either<
  NotAllowedError<UpdateCommunityNoteUseCaseRequest>,
  {
    communityNote: CommunityNote
  }
>

@Injectable()
export class UpdateCommunityNoteUseCase {
  constructor(private communityNoteRepository: CommunityNoteRepository) {}

  async execute(data: UpdateCommunityNoteUseCaseRequest): Promise<UpdateCommunityNoteUseCaseResponse> {
    const communityNote = await this.communityNoteRepository.findById(data.communityNoteId)

    if (!communityNote) {
      return left(
        new NotAllowedError<UpdateCommunityNoteUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Nota de Comunidade não encontrada'
            }
          ]
        })
      )
    }

    data.cause && (communityNote.cause = data.cause)
    data.status && (communityNote.status = data.status)
    // data.ratings && (communityNote.ratings = data.ratings)

    if (data.ratings) {
      const users = communityNote.ratings.currentItems.map(item => item.userId.toString())

      const newRatings = data.ratings.filter(item => !users.includes(item.userId)).map(item => CommunityNoteRating.create({
        userId:new UniqueEntityID(item.userId),
        noteId: communityNote.id,
        rating: item.rating
      }))

      const changedRatings = data.ratings
      .filter(item => users.includes(item.userId))
      .flatMap(item => {
        const sameRating = communityNote.ratings.currentItems.find(communityNoteRating => communityNoteRating.userId.toString() === item.userId 
        &&
        communityNoteRating.rating === item.rating)

        if (sameRating) return []

        return CommunityNoteRating.create({
          userId: new UniqueEntityID(item.userId),
          noteId: communityNote.id,
          rating: item.rating
        })
      })
      console.log(changedRatings)

      communityNote.ratings.update([
        ...newRatings,
        ...changedRatings
      ])

      console.log(JSON.stringify(communityNote.ratings, null, 2))
    }

    await this.communityNoteRepository.save(communityNote)

    return right({ communityNote })
  }
}