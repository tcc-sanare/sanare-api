import { PostRepository } from "@/domain/community/application/repositories/post-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { PrismaPostMapper } from "../../mappers/community/prisma-post-mapper";
import { Post } from "@/domain/community/enterprise/entities/post";

@Injectable()
export class PrismaPostRepository implements PostRepository {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  async create(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post)

    await this.prisma.posts.create({
      data
    })
  }

  async save(post: Post): Promise<void> {
    const data = PrismaPostMapper.toPrisma(post)

    await this.prisma.posts.update({
      where: {
        id: post.id.toString(),
        status: 'ACTIVED'
      },
      data,
    })
  }

  async delete(post: Post): Promise<void> {
    await this.prisma.posts.update({
      where: {
        id: post.id.toString()
      },
      data: {
        status: 'DELETED'
      }
    })
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.prisma.posts.findUnique({
      where: {
        id,
        status: 'ACTIVED'
      },
      include: {
        childPosts: true,
        notes: true
      }
    })

    if (!post) return null
    return PrismaPostMapper.toDomain(post)
  }

  async findByForumId(forumId: string): Promise<Post[]> {
    const posts = await this.prisma.posts.findMany({
      where: {
        forumId,
        status: 'ACTIVED'
      },
      include: {
        childPosts: true,
        notes: true
      }
    })

    return posts.map(PrismaPostMapper.toDomain)
  }
}