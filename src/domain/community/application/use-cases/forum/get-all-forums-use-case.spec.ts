import { InMemoryForumRepository } from "test/repositories/in-memory-forum-repository"
import { GetAllForumsUseCase } from "./get-all-forums-use-case"
import { makeForum } from "test/factories/make-forum"

describe('GetAllForumsUseCase', () => {
  let inMemoryForumRepository: InMemoryForumRepository
  let sut: GetAllForumsUseCase

  beforeEach(() => {
    inMemoryForumRepository = new InMemoryForumRepository()
    sut = new GetAllForumsUseCase(inMemoryForumRepository)
  })

  it('should return ALL forums created', async () => {
    const forum1 = makeForum()
    const forum2 = makeForum()
    const forum3 = makeForum()

    inMemoryForumRepository.items.push(forum1, forum2, forum3)

    const result = await sut.execute()

    expect(result.isRight()).toBeTruthy()
    if (result.isLeft()) return;
    expect(result.value.forums).toEqual([forum1, forum2, forum3])
  })
})