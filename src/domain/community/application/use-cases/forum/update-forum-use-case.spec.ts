import { InMemoryForumRepository } from "test/repositories/in-memory-forum-repository"
import { UpdateForumUseCase } from "./update-forum-use-case"
import { makeForum } from "test/factories/make-forum"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InMemoryStorage } from "test/storage/in-memory-storage"

describe('UpdateForumUseCase', () => {
  let inMemoryForumRepository: InMemoryForumRepository
  let sut: UpdateForumUseCase
  let inMemoryStorage: InMemoryStorage

  beforeEach(() => {
    inMemoryForumRepository = new InMemoryForumRepository
    inMemoryStorage = new InMemoryStorage();
    sut = new UpdateForumUseCase(inMemoryForumRepository, inMemoryStorage)
  })

  it('should update a forum', async () => {
    const id = new UniqueEntityID('123')
    const newBody = 'Descoberta nova forma de combater o matanol nas bebidas'
    const newLink = 'https://linkficticio.com'
    const forum = makeForum({}, id)

    inMemoryForumRepository.items.push(forum)

    const response = await sut.execute({
      forumId: id.toString(),
      body: newBody,
      link: newLink,
    })

    expect(response.isRight()).toBeTruthy()

    if(!response.isRight()) return;

    expect(response.value.forum.id.toString()).toEqual(id.toString())
    expect(response.value.forum.body).toEqual(newBody)
    expect(inMemoryForumRepository.items[0].body).toEqual(newBody)
  });

  it('should not update a forum', async () => {
    const response = await sut.execute({
      forumId: '123',
      body: 'Descoberta nova forma de combater o matanol nas bebidas',
      link: 'https://linkficticio.com',
    })

    expect(response.isLeft()).toBeTruthy()

    if(!response.isLeft()) return;

    expect(response.value).toBeInstanceOf(Error)
  });
})