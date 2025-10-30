import { CommunityNoteRepository } from "@/domain/community/application/repositories/community-note-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note";
import { PrismaCommunityNoteMapper } from "../../mappers/community/prisma-community-note-mapper";

@Injectable()
export class PrismaCommunityNoteRepository implements CommunityNoteRepository {
  constructor (
    private readonly prisma: PrismaService
  ) {}

  async create(communityNote: CommunityNote): Promise<void> {
    const data = PrismaCommunityNoteMapper.toPrisma(communityNote

    )
    await this.prisma.communityNotes.create({
      data
    })
  }

  async save(communityNote: CommunityNote): Promise<void> {
    const data = PrismaCommunityNoteMapper.toPrisma(communityNote)
    console.log(data)

    await this.prisma.communityNotes.update({
      where: {
        id: data.id,
        status: 'ACTIVED'
      },
      data: {
        ...data,
        ratings: {
          deleteMany: communityNote.ratings.getRemovedItems().map(note => ({
            userId: note.userId.toString()
          })),
          createMany: {
            data: communityNote.ratings.getNewItems().map(note => ({
              userId: note.userId.toString(),
              rating: note.rating
            }))
          }
        }
      }
    })
  }

  async delete(communityNote: CommunityNote): Promise<void> {
    await this.prisma.communityNotes.update({
      where: {
        id: communityNote.id.toString()
      },
      data: {
        status: 'DELETED'
      }
    })
  }


  async findById(id: string): Promise<CommunityNote | null> {
    const communityNote = await this.prisma.communityNotes.findUnique({
      where: {
        id,
        status: 'ACTIVED'
      },
      include: {
        ratings: true
      }
    })

    if (!communityNote) return null

    return PrismaCommunityNoteMapper.toDomain(communityNote)
  }

  async findAllCommunityNotesByPostId(postId: string): Promise<CommunityNote[]> {
    const communityNotes = await this.prisma.communityNotes.findMany({
      where: {
        postId,
        status: 'ACTIVED'
      }
    })

    return communityNotes.map(PrismaCommunityNoteMapper.toDomain)
  }
}