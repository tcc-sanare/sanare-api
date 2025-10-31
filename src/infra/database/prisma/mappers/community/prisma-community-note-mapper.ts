import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note";
import { CommunityNoteRating } from "@/domain/community/enterprise/entities/community-note-rating";
import { CommunityNoteRatingList } from "@/domain/community/enterprise/entities/community-notes-rating-list";
import { CommunityNoteRatings, CommunityNotes, Prisma } from "@prisma/client";

export class PrismaCommunityNoteMapper {
  static toDomain(raw: CommunityNotes & {
    ratings: CommunityNoteRatings[]
  }): CommunityNote {
    return CommunityNote.create({
      cause: raw.cause,
      userId: raw.userId,
      postId: raw.postId,
      status: raw.status,
      ratings: new CommunityNoteRatingList(raw.ratings.map(item => CommunityNoteRating.create({
        userId: new UniqueEntityID(item.userId),
        noteId: new UniqueEntityID(item.noteId),
        rating: item.rating
      }, new UniqueEntityID(item.noteId)))),
      
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(communityNote: CommunityNote): Prisma.CommunityNotesUncheckedCreateInput {
    return {
      id: communityNote.id.toString(),
      cause: communityNote.cause,
      userId: communityNote.userId,
      postId: communityNote.postId,
      status: communityNote.status,
      createdAt: communityNote.createdAt,
      updatedAt: communityNote.updatedAt,
    }
  }
}