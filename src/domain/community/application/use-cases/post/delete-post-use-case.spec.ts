import { InMemoryPostRepository } from "test/repositories/in-memory-post-repository"
import { DeletePostUseCase } from "./delete-post-use-case"
import { makePost } from "test/factories/make-post"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

describe('DeletePostUseCase', () => {
  let inMemoryPostRepository: InMemoryPostRepository
  let sut: DeletePostUseCase

  beforeEach(() => {
    inMemoryPostRepository = new InMemoryPostRepository
    sut = new DeletePostUseCase(inMemoryPostRepository)
  })

  it('should delete a post by id', async () => {
    const id = new UniqueEntityID('123')
    const post = makePost({}, id)
    inMemoryPostRepository.items.push(post)

    expect(inMemoryPostRepository.items[0]).toEqual(post)

    const response = await sut.execute({
      postId: id.toString()
    })

    expect(response.isRight()).toBeTruthy()
    if (!response.isRight()) return;
    expect(response.value.post).toEqual(post)
    expect(inMemoryPostRepository.items).toEqual([])
  });

  it('should not delete a post by id', async () => {
    const id = new UniqueEntityID('123')

    const response = await sut.execute({
      postId: id.toString()
    })

    expect(response.isLeft()).toBeTruthy()
    if (!response.isLeft()) return;
    expect(response.value).toBeInstanceOf(Error)
  });
})