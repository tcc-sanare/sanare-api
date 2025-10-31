import { Post } from "@/domain/community/enterprise/entities/post"
import { Injectable } from "@nestjs/common"
import { ForumRepository } from "../../repositories/forum-repository"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { Forum } from "@/domain/community/enterprise/entities/forum"
import { Either, left, right } from "@/core/either"
import { Storage } from "@/domain/application/storage"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ForumSave } from "@/domain/community/enterprise/entities/forum-save"

type UpdateForumUseCaseRequest = {
  forumId: string
  body?: string
  link?: string
  imageKey?:{
    fileName: string
    fileType: string
    buffer: Buffer
  } | null
  posts?: {
    id: string,
    body: string,
    status: 'ACTIVED' | 'DELETED',
    userId: string,
    forumId: string,
    parentId?: string,

    createdAt: Date,
    updatedAt: Date,
  }[],

  saves?: {
    userId: string
  }[]
}

type UpdateForumUseCaseResponse = Either<
  NotAllowedError<UpdateForumUseCaseRequest>,
  {
    forum: Forum
  }
>
@Injectable()
export class UpdateForumUseCase {
  constructor(
    private forumRepository: ForumRepository,
    private storage: Storage
  ) {}

  async execute(data: UpdateForumUseCaseRequest): Promise<UpdateForumUseCaseResponse> {
    const forum = await this.forumRepository.findById(data.forumId) 

    if (!forum) {
      return left(
        new NotAllowedError<UpdateForumUseCaseRequest>({
          statusCode: 400,
          errors: [
            {
              message: 'Forum não encontrado'
            },
          ],
        }));
    }

    data.body && (forum.body = data.body)
    data.link && (forum.link = data.link)

    if (data.posts && data.posts[0]) {
      const posts = data.posts.map(item => Post.create({
        body: item.body,
        userId: item.userId,
        parentId: item.parentId || null,
        forumId: forum.id.toString(),
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))

      forum.posts = posts
    }

    if (data.saves) {
      const users = forum.saves.currentItems.map(item => item.userId.toString())

      forum.saves.update(
        data.saves
          .filter(save => !users.includes(save.userId))
          .map(save => ForumSave.create({
            userId: new UniqueEntityID(save.userId),
            forumId: new UniqueEntityID(data.forumId)
          }))
      )
    }


    if (data.imageKey !== undefined) {
      if (data.imageKey) {
        await forum.imageKey.delete()
      }

      forum.imageKey = data.imageKey ? await this.storage.upload({
        fileName: data.imageKey.fileName,
        fileType: data.imageKey.fileType,
        buffer: data.imageKey.buffer
      }) : null
    }

    await this.forumRepository.save(forum)

    return right ({ forum })
  }
}