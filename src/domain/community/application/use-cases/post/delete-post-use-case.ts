import { Injectable } from "@nestjs/common";
import { PostRepository } from "../../repositories/post-repository";
import { Either, left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Post } from "@/domain/community/enterprise/entities/post";

type DeletePostUseCaseRequest = {
  postId: string
}

type DeletePostUseCaseResponse = Either<
  NotAllowedError<DeletePostUseCaseRequest>,
  {
    post: Post
  }
>

@Injectable()
export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(data: DeletePostUseCaseRequest): Promise<DeletePostUseCaseResponse> {
    const post = await this.postRepository.findById(data.postId)

    if (!post) {
      return left(
        new NotAllowedError<DeletePostUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Post não encontrado'
            },
          ],
        }),
      );
    }

    await this.postRepository.delete(post)

    return right({ post })
  }
}