import { InMemoryCommunityNoteRepository } from "test/repositories/in-memomry-community-note-repository"
import { UpdateCommunityNoteUseCase } from "./update-community-note-use-case"
import { makeCommunityNote } from "test/factories/make-community-note"

describe('UpdateCommunityNoteUseCase', () => {
  let inMemoryCommunityNoteRepository: InMemoryCommunityNoteRepository
  let sut: UpdateCommunityNoteUseCase

  beforeEach(() => {
    inMemoryCommunityNoteRepository = new InMemoryCommunityNoteRepository()
    sut = new UpdateCommunityNoteUseCase(inMemoryCommunityNoteRepository)
  })

  it('should update a community note', async () => {
    const newCause = 'nova causa'
    const communityNote = makeCommunityNote()
    inMemoryCommunityNoteRepository.items.push(communityNote)

    const response = await sut.execute({
      communityNoteId: communityNote.id.toString(),
      cause: newCause,
      status: 'DELETED'
    })

    expect(response.isRight()).toBeTruthy()
    if (!response.isRight()) return;
    expect(response.value.communityNote.cause).toEqual(newCause)
    expect(response.value.communityNote.postId).toEqual(communityNote.postId)
    expect(response.value.communityNote.userId).toEqual(communityNote.userId)
  });

  it('should update a community note', async () => {
    const newCause = 'nova causa'
    const communityNote = makeCommunityNote()
    inMemoryCommunityNoteRepository.items.push(communityNote)

    const response = await sut.execute({
      communityNoteId: '123',
      cause: newCause,
      status: 'DELETED'
    })

    expect(response.isLeft()).toBeTruthy()
    if (!response.isLeft()) return;
    expect(response.value.props.statusCode).toEqual(400)
    expect(response.value).toBeInstanceOf(Error)
  });
})