import { Either, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Post } from "@/domain/community/enterprise/entities/post"
import { Injectable } from "@nestjs/common"
import { PostRepository } from "../../repositories/post-repository"

type GetPostsByForumIdUseCaseRequest = {
  forumId: string
}

type GetPostsByForumIdUseCaseResponse = Either<
  ResourceNotFoundError<GetPostsByForumIdUseCaseRequest>,
  {
    posts: Post[]
  }
>

@Injectable() 
export class GetPostsByForumIdUseCase {
  constructor(
    private postRepository: PostRepository
  ) {}

  async execute(data: GetPostsByForumIdUseCaseRequest): Promise<GetPostsByForumIdUseCaseResponse> {
    const posts = await this.postRepository.findByForumId(data.forumId)

    return right({ posts })
  }
}