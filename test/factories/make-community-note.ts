import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommunityNote, CommunityNoteProps } from "@/domain/community/enterprise/entities/community-note";
import { faker } from "@faker-js/faker";

export function makeCommunityNote(
  override: Partial<CommunityNoteProps> = {},
  id?: UniqueEntityID
) {
  const communityNote = CommunityNote.create({
    cause: faker.lorem.paragraph(),
    userId: String(faker.number.bigInt()),
    postId: String(faker.number.bigInt())
  }, id)

  return communityNote
}