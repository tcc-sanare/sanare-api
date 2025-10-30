import { InMemoryPostRepository } from "test/repositories/in-memory-post-repository"
import { UpdatePostUseCase } from "./update-post-use-case"
import { makePost } from "test/factories/make-post"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

describe('UpdatePostUseCase', () => {
  let inMemoryPostRepository: InMemoryPostRepository
  let sut: UpdatePostUseCase

  beforeEach(() => {
    inMemoryPostRepository = new InMemoryPostRepository()
    sut = new UpdatePostUseCase(inMemoryPostRepository)
  })

  it('should update a post', async () => {
    const id = new UniqueEntityID('123')
    const post = makePost({}, id)
    const newBody = 'Abluabla'

    inMemoryPostRepository.items.push(post)

    const response = await sut.execute({
      postId: id.toString(),
      body: newBody
    })

    expect(response.isRight()).toBeTruthy()
    if (!response.isRight()) return;
    expect(response.value.post.body).toEqual(newBody)
  });

  it('should not update a post', async () => {
    const id = new UniqueEntityID('123')
    const newBody = 'Abluabla'

    const response = await sut.execute({
      postId: id.toString(),
      body: newBody
    })

    expect(response.isLeft()).toBeTruthy()
    if (!response.isLeft()) return;
    expect(response.value).toBeInstanceOf(Error)
  });
})