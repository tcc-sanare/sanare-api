import { makeForum } from "test/factories/make-forum"
import { GetForumByIdUseCase } from "./get-forum-by-id-use-case"
import { InMemoryForumRepository } from "test/repositories/in-memory-forum-repository"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

describe('GetForumByIdUseCase', () => {
  let sut: GetForumByIdUseCase
  let inMemoryForumRepository: InMemoryForumRepository

  beforeEach(() => {
    inMemoryForumRepository = new InMemoryForumRepository
    sut = new GetForumByIdUseCase(inMemoryForumRepository)
  })

  it('should get a forum by id', async () => {
    const id = new UniqueEntityID('123')
    const fourm = makeForum({}, id)

    inMemoryForumRepository.items.push(fourm)

    const response = await sut.execute({
      forumId: id.toString()
    })

    expect(response.isRight()).toBeTruthy()
    if(!response.isRight()) return;
    expect(response.value.forum.id.toString()).toEqual(id.toString())
    expect(response.value.forum.name).toEqual(fourm.name)
  });

  it('should not get a forum by id', async () => {
    const response = await sut.execute({
      forumId: '123'
    })
    console.log(response)

    expect(response.isLeft()).toBeTruthy()
    if(!response.isLeft()) return;
    expect(response.value).toBeInstanceOf(Error)
  })
})