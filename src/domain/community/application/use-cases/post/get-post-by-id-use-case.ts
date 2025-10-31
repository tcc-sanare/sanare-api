import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Post } from "@/domain/community/enterprise/entities/post"
import { Injectable } from "@nestjs/common"
import { PostRepository } from "../../repositories/post-repository"

type GetPostByIdUseCaseRequest = {
  postId: string
}

type GetPostByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetPostByIdUseCaseRequest>,
  {
    post: Post
  }
>

@Injectable()
export class GetPostByIdUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(data: GetPostByIdUseCaseRequest): Promise<GetPostByIdUseCaseResponse> {
    const post = await this.postRepository.findById(data.postId)

    if (!post) {
      return left(
        new ResourceNotFoundError<GetPostByIdUseCaseRequest>({
          errors: [
            {
              message: 'Post não encontrado'
            }
          ]
        })
      )
    }

    return right({ post })
  }
}