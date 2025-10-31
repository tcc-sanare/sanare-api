import { Injectable } from "@nestjs/common";
import { ForumRepository } from "../../repositories/forum-repository";
import { Forum } from "@/domain/community/enterprise/entities/forum";
import { Either, right } from '@/core/either';
import { StoragedFile } from "@/core/entities/storaged-file";
import { Post } from "@/domain/community/enterprise/entities/post";
import { ForumSave } from "@/domain/community/enterprise/entities/forum-save";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ForumSaveList } from "@/domain/community/enterprise/entities/forum-save-list";

interface CreateForumUseCaseRequest {
  body: string,
  link: string
  posts?: {
    id: string,
    body: string,
    status: 'ACTIVED' | 'DELETED',
    userId: string,
    forumId: string,
    parentId?: string,

    createdAt: Date,
    updatedAt: Date,
  }[]
  saves?: {
    userId: string
  }[]
}

type CreateForumUseCaseResponse = Either<
  null,
  {
    forum: Forum
  }
>

@Injectable()
export class CreateForumUseCase {
  constructor(private forumRepositoy: ForumRepository) {}

  async execute(data: CreateForumUseCaseRequest): Promise<CreateForumUseCaseResponse> {
    const forum = Forum.create({
      body: data.body,
      link: data.link,
      imageKey: null,
    });

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
      const postSaves = data.saves.map(item => ForumSave.create({
        userId: new UniqueEntityID(item.userId),
        forumId: new UniqueEntityID(forum.id.toString())
      }))

      data.saves && (forum.saves = new ForumSaveList(postSaves))
    }

    await this.forumRepositoy.create(forum)

    return right({ forum })
  }
}