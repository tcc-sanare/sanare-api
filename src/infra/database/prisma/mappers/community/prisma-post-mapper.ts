import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note";
import { Post } from "@/domain/community/enterprise/entities/post";
import { CommunityNotes, Posts, Prisma } from "@prisma/client";

export class PrismaPostMapper {
  static toDomain(raw: Posts & {
    childPosts: Posts[],
    notes: CommunityNotes[]
  }): Post {
    return Post.create({
      body: raw.body,
      forumId: raw.forumId,
      parentId: raw.parentId,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      userId: raw.userId,
      childPosts: raw.childPosts.map(post => Post.create({
        ...post
      }, new UniqueEntityID(post.id))),
      notes: raw.notes.map(note => CommunityNote.create({
        ...note
      }))

    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(post: Post): Prisma.PostsUncheckedCreateInput {
    return {
      body: post.body,
      forumId: post.forumId,
      userId: post.userId,
      parentId: post.parentId,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  }
}