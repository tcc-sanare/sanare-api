import { Injectable } from "@nestjs/common";
import { CommunityNoteRepository } from "../../repositories/community-note-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note";

type GetAllCommunityNotesByPostIdRequest = {
  postId: string
}

type GetAllCommunityNotesByPostIdResponse = Either<
  ResourceNotFoundError<GetAllCommunityNotesByPostIdRequest>,
  {
    communityNotes: CommunityNote[]
  }
>

@Injectable()
export class GetAllCommunityNotesByPostIdUseCase {
  constructor (
    private communityNoteRepositoty: CommunityNoteRepository
  ) {}

  async execute(data: GetAllCommunityNotesByPostIdRequest): Promise<GetAllCommunityNotesByPostIdResponse> {
    const communityNotes = await this.communityNoteRepositoty.findAllCommunityNotesByPostId(data.postId)

    if (!communityNotes) {
      return left(
        new ResourceNotFoundError<GetAllCommunityNotesByPostIdRequest>({
          errors: [
            {
              message: 'Nota da Comunidade não encontrada'
            }
          ]
        })
      )
    }

    return right ({ communityNotes })
  }
}