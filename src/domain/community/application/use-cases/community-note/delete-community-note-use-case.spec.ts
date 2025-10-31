import { InMemoryCommunityNoteRepository } from "test/repositories/in-memomry-community-note-repository"
import { DeleteCommunityNoteUseCase } from "./delete-community-note-use-case"
import { makeCommunityNote } from "test/factories/make-community-note"
import { CommunityNote } from "@/domain/community/enterprise/entities/community-note"

describe('DeleteCommunityNoteUseCase', () => {
  let inMemoryCommunityNoteRepository: InMemoryCommunityNoteRepository
  let sut: DeleteCommunityNoteUseCase

  beforeEach(() => {
    inMemoryCommunityNoteRepository = new InMemoryCommunityNoteRepository()
    sut = new DeleteCommunityNoteUseCase(inMemoryCommunityNoteRepository)
  })

  it('should delete a community note by id', async () => {
    const communityNote = makeCommunityNote()
    inMemoryCommunityNoteRepository.items.push(communityNote)

    expect(inMemoryCommunityNoteRepository.items[0]).toBeInstanceOf(CommunityNote)

    const response = await sut.execute({
      communityNoteId: communityNote.id.toString()
    })

    expect(response.isRight()).toBeTruthy()
    if (!response.isRight()) return;
    expect(response.value.communityNote.cause).toEqual(communityNote.cause)
    expect(response.value.communityNote.postId).toEqual(communityNote.postId)
    expect(response.value.communityNote.userId).toEqual(communityNote.userId)
    expect(inMemoryCommunityNoteRepository.items).toEqual([])
  });

  it('should not delete a community note by id', async () => {
    const communityNote = makeCommunityNote()
    inMemoryCommunityNoteRepository.items.push(communityNote)

    expect(inMemoryCommunityNoteRepository.items[0]).toBeInstanceOf(CommunityNote)

    const response = await sut.execute({
      communityNoteId: '123'
    })

    expect(response.isLeft()).toBeTruthy()
    if (!response.isLeft()) return;
    expect(response.value).toBeInstanceOf(Error)
    expect(response.value.props.statusCode).toEqual(400)
  });
})