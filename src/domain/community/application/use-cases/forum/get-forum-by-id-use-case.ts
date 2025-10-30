import { Injectable } from "@nestjs/common";
import { ForumRepository } from "../../repositories/forum-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Forum } from "@/domain/community/enterprise/entities/forum";

type GetForumByIdUseCaseRequest = {
  forumId: string
}

type  GetForumByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetForumByIdUseCaseRequest>,
  {
    forum: Forum
  }
>

@Injectable()
export class GetForumByIdUseCase {
  constructor (private forumRepository: ForumRepository) {}

  async execute(data: GetForumByIdUseCaseRequest): Promise<GetForumByIdUseCaseResponse> {
    const forum = await this.forumRepository.findById(data.forumId)

    if (!forum) {
      return left(
        new ResourceNotFoundError<GetForumByIdUseCaseRequest>({
          errors: [
            {
              message: 'Forum não encontrado'
            }
          ]
        })
      )
    }

    return right ({ forum })
  }
}