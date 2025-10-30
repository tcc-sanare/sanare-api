import { InMemoryPostRepository } from "test/repositories/in-memory-post-repository"
import { CreatePostUseCase } from "./create-post-use-case";
import { makePost } from "test/factories/make-post";

describe('CreatePostUseCase', () => {
  let inMemoryPostRepository: InMemoryPostRepository;
  let sut: CreatePostUseCase

  beforeEach(() => {
    inMemoryPostRepository = new InMemoryPostRepository
    sut = new CreatePostUseCase(inMemoryPostRepository)
  })

  it('should create a post', async () => {
    const post = makePost()

    const response = await sut.execute({
      body: post.body,
      userId: post.userId,
      forumId: post.forumId
    })

    console.log(response.value.post)

    expect(response.isRight()).toBeTruthy()
    if(!response.isRight()) return;
    expect(response.value.post.body).toEqual(post.body)
  })
})