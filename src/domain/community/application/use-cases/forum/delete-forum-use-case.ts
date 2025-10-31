import { Injectable } from "@nestjs/common";
import { ForumRepository } from "../../repositories/forum-repository";
import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Forum } from "@/domain/community/enterprise/entities/forum";

type DeleteForumUseCaseRequest = {
  forumId: string
}

type DeleteForumUseCaseResponse = Either<
 NotAllowedError<DeleteForumUseCaseRequest>,
 {
  forum: Forum
 }
>

@Injectable()
export class DeleteForumUseCase {
  constructor(private forumRepository: ForumRepository) {}

  async execute(data: DeleteForumUseCaseRequest): Promise<DeleteForumUseCaseResponse> {
    const forum = await this.forumRepository.findById(data.forumId)

    if (!forum) {
      return left(
        new NotAllowedError<DeleteForumUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Forum não encontrado'
            },
          ],
        }),
      );
    }

    await this.forumRepository.delete(forum)

    return right({ forum })
  }
}