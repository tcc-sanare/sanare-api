import { CommunityNote } from "../../enterprise/entities/community-note";

export abstract class CommunityNoteRepository {
  abstract create(communityNote: CommunityNote): Promise<void>
  abstract delete(communityNote: CommunityNote): Promise<void>
  abstract save(communityNote: CommunityNote): Promise<void>
  abstract findById(id: string): Promise<CommunityNote | null>
  abstract findAllCommunityNotesByPostId(postId: string): Promise<CommunityNote[]>
  // Precisa achar todas por id do post?
}