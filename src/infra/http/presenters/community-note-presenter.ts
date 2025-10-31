import { CommunityNote } from "@/domain/community/enterprise/entities/community-note";

export class CommunityNotePresenter {
  static toHttp(communityNote: CommunityNote) {
    const {
      id,
      cause,
      userId,
      postId,
      status
    } = communityNote

    return {
      id: id.toString(),
      cause,
      status,
      userId,
      postId
    }
  }
}