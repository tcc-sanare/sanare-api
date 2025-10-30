import { ForumRepository } from "@/domain/community/application/repositories/forum-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { Storage } from "@/domain/application/storage";
import { Forum } from "@/domain/community/enterprise/entities/forum";
import { PrismaForumMapper } from "../../mappers/community/prisma-forum-mapper";
import { Post } from "@/domain/community/enterprise/entities/post";

@Injectable()
export class PrismaForumRepository implements ForumRepository {
  constructor (
    private readonly prisma: PrismaService,
    private storage: Storage
  ) {}

  async create(forum: Forum): Promise<void> {
    const data = PrismaForumMapper.toPrisma(forum)

    await this.prisma.forums.create({
      data
    })
  }

  async save(forum: Forum): Promise<void> {
    const data = PrismaForumMapper.toPrisma(forum)

    await this.prisma.forums.update({
      where: {
        id: forum.id.toString(),
        status: 'ACTIVED'
      },
      data: {
        ...data,
        saves: {
          deleteMany: forum.saves.getRemovedItems().map(save => ({
            userId: save.userId.toString()
          })),
          createMany: {
            data: forum.saves.getNewItems().map(save => ({
              userId: save.userId.toString()
            }))
          }
        }
      }
    })
  }

  async delete(forum: Forum): Promise<void> {
    await this.prisma.forums.update({
      where: {
        id: forum.id.toString(),
      },
      data: {
        status: "DELETED"
      }
    })
  }

  async findById(id: string): Promise<Forum | null> {
    const forum = await this.prisma.forums.findUnique({
      where: {
        id,
        status: 'ACTIVED'
      },
      include: {
        saves: true,
        posts: true,
      }
    });

    if (!forum) return null
    return PrismaForumMapper.toDomain(forum, this.storage)
  }

  async findByName(name: string): Promise<Forum[] | null> {
    const forum = await this.prisma.forums.findMany({
      where: {
        status: 'ACTIVED',
        body: {
          contains: name,
          mode: "insensitive"
        }
      },
      include: {
        saves: true,
        posts: true,
      }
    });

    if (!forum) return null
    return forum.map(item => PrismaForumMapper.toDomain(item, this.storage))
  }

  async findAll(): Promise<Forum[]> {
    const forums = await this.prisma.forums.findMany({
      include: {
        saves: true,
        posts: true,
      }
    })
    return forums.map(item => PrismaForumMapper.toDomain(item, this.storage))
  }
}