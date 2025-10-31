import { Either, left, right } from "@/core/either";
import { Post } from "@/domain/community/enterprise/entities/post";
import { Injectable } from "@nestjs/common";
import { PostRepository } from "../../repositories/post-repository";
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Gemini } from "@/domain/gemini-ai/gemini-ai";

interface CreatePostUseCaseRequest {
  body: string,
  userId: string,
  forumId: string,

  parentId?: string,

  notes?: {
    id: string,
    cause: string,
    status: 'ACTIVED' | 'DELETED',
    userId: string,
  }[],

  childPosts?: {
    id: string,
    body: string,
    status: 'ACTIVED' | 'DELETED',
    userId: string,
    createdAt: Date,
    updatedAt: Date,
  }[]
}

type CreatePostUseCaseResponse = Either<
  NotAllowedError<CreatePostUseCaseRequest>,
  {
    post: Post
  }
>

@Injectable()
export class CreatePostUseCase {
  constructor(
    private postRepository: PostRepository,
    private postChecker: Gemini
  ) {}

  async execute(data: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = Post.create({
      body: data.body,
      userId: data.userId,
      forumId: data.forumId,
      parentId: data.parentId,
    })

    const check = await this.postChecker.checkPost({
      content: post.body
    })
    if (!check) {
      return left(
        new NotAllowedError<CreatePostUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Conteúdo inpropriado na mensagem'
            }
          ]
        })
      )
    }

    

    if (data.childPosts) {
      const childPosts = data.childPosts.map(item => Post.create({
        body: item.body,
        status: item.status,
        parentId: post.id.toString(),
        forumId: post.forumId,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        userId: item.userId,
      }, new UniqueEntityID(item.id)))

      data.childPosts && (post.childPosts = childPosts)
    }

    if (data.notes) {
      const notes = data.notes.map(item => CommunityNote.create({
        cause: item.cause,
        status: item.status,
        userId: item.userId,
        postId: post.id.toString(),
      }))

      data.notes && (post.notes = notes)
    }

    await this.postRepository.create(post)

    return right({ post })

  }
}