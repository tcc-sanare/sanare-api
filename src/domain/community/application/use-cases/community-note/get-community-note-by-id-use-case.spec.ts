import { InMemoryCommunityNoteRepository } from "test/repositories/in-memomry-community-note-repository"
import { GetCommunityNoteByIdUseCase } from "./get-community-note-by-id-use-case"
import { makeCommunityNote } from "test/factories/make-community-note"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

describe('GetCommunityNoteUseCase', () => {
  let inMemoryCommunityNoteRepository: InMemoryCommunityNoteRepository
  let sut: GetCommunityNoteByIdUseCase

  beforeEach(() => {
    inMemoryCommunityNoteRepository = new InMemoryCommunityNoteRepository()
    sut = new GetCommunityNoteByIdUseCase(inMemoryCommunityNoteRepository)
  })

  it('should return a community note by id', async () => {
    const id = new UniqueEntityID('123')
    const communityNote = makeCommunityNote({}, id)

    inMemoryCommunityNoteRepository.items.push(communityNote)

    const response = await sut.execute({
      communityNoteId: id.toString()
    })

    expect(response.isRight()).toBeTruthy()
    if(!response.isRight()) return;
    expect(response.value.communityNote.cause).toEqual(communityNote.cause)
    expect(response.value.communityNote.postId).toEqual(communityNote.postId)
    expect(response.value.communityNote.userId).toEqual(communityNote.userId)
  });

  it('should return a community note by id', async () => {
    const communityNote = makeCommunityNote({})

    inMemoryCommunityNoteRepository.items.push(communityNote)

    const response = await sut.execute({
      communityNoteId: '123'
    })

    expect(response.isLeft()).toBeTruthy()
    if(!response.isLeft()) return;
    expect(response.value).toBeInstanceOf(Error)
  });
})