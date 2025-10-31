import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { Post } from "@/domain/community/enterprise/entities/post"
import { Injectable } from "@nestjs/common"
import { PostRepository } from "../../repositories/post-repository"

type UpdatePostUseCaseRequest = {
  postId: string
  body?: string
  status?: 'ACTIVED' | 'DELETED'
  saves?: {
    userId: string
  }[]
}

type UpdatePostUseCaseResponse = Either<
  NotAllowedError<UpdatePostUseCaseRequest>,
  {
    post: Post
  }
>

@Injectable()
export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(data: UpdatePostUseCaseRequest): Promise<UpdatePostUseCaseResponse> {
    const post = await this.postRepository.findById(data.postId)

    if (!post) {
      return left(
        new NotAllowedError<UpdatePostUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Post não encontrado'
            },
          ],
        })
      );
    }
    data.body && (post.body = data.body)
    data.status && (post.status = data.status)

    await this.postRepository.save(post)

    return right({ post })
  }
}