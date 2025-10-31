import { InMemoryCommunityNoteRepository } from "test/repositories/in-memomry-community-note-repository"
import { CreateCommunityNoteUseCase } from "./create-community-note-use-case"
import { makeCommunityNote } from "test/factories/make-community-note"

describe('CreateCommunityNoteUseCase', () => {
  let inMemoryCommunityNoteRepository: InMemoryCommunityNoteRepository
  let sut: CreateCommunityNoteUseCase

  beforeEach(() => {
    inMemoryCommunityNoteRepository = new InMemoryCommunityNoteRepository()
    sut =  new CreateCommunityNoteUseCase(inMemoryCommunityNoteRepository)
  })

  it('should create a community note', async () => {
    const communityNote = makeCommunityNote()

    const response = await sut.execute({
      cause: communityNote.cause,
      userId: communityNote.userId,
      postId: communityNote.postId,
      ratings: communityNote.ratings
    })

    expect(response.isRight()).toBeTruthy()
    if (!response.isRight()) return;
    expect(response.value.communityNote.postId).toEqual(communityNote.postId)
    expect(response.value.communityNote.userId).toEqual(communityNote.userId)
    expect(response.value.communityNote.cause).toEqual(communityNote.cause)
  })
})