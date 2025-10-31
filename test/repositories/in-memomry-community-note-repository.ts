import { CommunityNoteRepository } from "@/domain/community/application/repositories/community-note-repository";
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note";

export class InMemoryCommunityNoteRepository implements CommunityNoteRepository {
  public items: CommunityNote[] = []

  async create(communityNote: CommunityNote): Promise<void> {
    this.items.push(communityNote)
  }

  async delete(communityNote: CommunityNote): Promise<void> {
    const communityNoteIndex = this.items.findIndex(item => item.id.toString() === communityNote.id.toString())

    if (communityNoteIndex === -1) {
      throw new Error('Community note not found')
    }

    this.items.splice(communityNoteIndex, 1)
  }

  async save(communityNote: CommunityNote): Promise<void> {
    const communityNoteIndex = this.items.findIndex(item => item.id.toString() === communityNote.id.toString())

    if (communityNoteIndex === -1) {
      throw new Error('Community note not found')
    }

    this.items[communityNoteIndex] = communityNote
  }

  async findById(id: string): Promise<CommunityNote | null> {
    return this.items.find(item => item.id.toString() === id) || null
  }

}