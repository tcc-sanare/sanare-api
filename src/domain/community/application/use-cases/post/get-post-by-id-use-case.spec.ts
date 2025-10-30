import { InMemoryPostRepository } from "test/repositories/in-memory-post-repository"
import { GetPostByIdUseCase } from "./get-post-by-id-use-case"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { makePost } from "test/factories/make-post"

describe('GetPostByIdUseCase', () => {
  let inMemoryPostRepository: InMemoryPostRepository
  let sut: GetPostByIdUseCase

  beforeEach(() => {
    inMemoryPostRepository = new InMemoryPostRepository()
    sut = new GetPostByIdUseCase(inMemoryPostRepository)
  })

  it('should get a post by id', async () => {
    const id = new UniqueEntityID('123')
    const post = makePost({}, id)
    inMemoryPostRepository.items.push(post)

    const response = await sut.execute({
      postId: id.toString()
    })

    expect(response.isRight()).toBeTruthy()
    if (!response.isRight()) return;
    expect(response.value.post).toEqual(post)
    expect(response.value.post.body).toEqual(post.body)
  });

  it('should get a post by id', async () => {
    const id = new UniqueEntityID('123')
    const response = await sut.execute({
      postId: id.toString()
    })

    expect(response.isLeft()).toBeTruthy()
    if (!response.isLeft()) return;
    expect(response.value).toBeInstanceOf(Error)
  });
})