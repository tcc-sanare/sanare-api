import { StoragedFile } from "@/core/entities/storaged-file";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Storage } from "@/domain/application/storage";
import { Forum } from "@/domain/community/enterprise/entities/forum";
import { ForumSave } from "@/domain/community/enterprise/entities/forum-save";
import { ForumSaveList } from "@/domain/community/enterprise/entities/forum-save-list";
import { Post } from "@/domain/community/enterprise/entities/post";
import { Forums, Prisma, ForumSaves, Posts } from "@prisma/client";

export class PrismaForumMapper {
  static toDomain(raw: Forums & {
    saves: ForumSaves[],
    posts: Posts[]
  }, storage: Storage): Forum {
    return Forum.create({
      body: raw.body,
      link: raw.link,
      imageKey: raw.imageKey ? new StoragedFile(raw.imageKey, storage) : null,
      status: raw.status,
      saves: new ForumSaveList(raw.saves.map(item => ForumSave.create({
        userId: new UniqueEntityID(item.userId),
        forumId: new UniqueEntityID(item.forumId)
      }))),
      posts: raw.posts.map(post => Post.create({
        ...post
      }))
    }, new UniqueEntityID(raw.id))
  }
  static toPrisma(forum: Forum): Prisma.ForumsUncheckedCreateInput {
    return {
      body: forum.body,
      link: forum.link,
      imageKey: forum.imageKey?.key || null,
      status: forum.status,
      createdAt: forum.createdAt,
      updatedAt: forum.updatedAt,
    }
  }
}