import { Either, right } from "@/core/either";
import { ForumRepository } from "../../repositories/forum-repository";
import { Forum } from "@/domain/community/enterprise/entities/forum";
import { Injectable } from "@nestjs/common";

type GetAllForumsUseCaseResponse = Either<
  null,
  {
    forums: Forum[]
  }
>

@Injectable()
export class GetAllForumsUseCase {
  constructor (
    private forumRepository: ForumRepository
  ) {}

  async execute(): Promise<GetAllForumsUseCaseResponse> {
    const forums = await this.forumRepository.findAll()

    return right({ forums })
  }
}