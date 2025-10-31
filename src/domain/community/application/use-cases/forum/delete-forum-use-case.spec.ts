import { InMemoryForumRepository } from "test/repositories/in-memory-forum-repository";
import { DeleteForumUseCase } from "./delete-forum-use-case"
import { makeForum } from "test/factories/make-forum";

describe('DeleteForumUseCase', () => {
  let sut: DeleteForumUseCase;
  let inMemoryForumRepository: InMemoryForumRepository

  beforeEach(() => {
    inMemoryForumRepository = new InMemoryForumRepository
    sut = new DeleteForumUseCase(inMemoryForumRepository)
  })

  it('should delete a forum by id', async () => {
    const forum = makeForum()
    inMemoryForumRepository.items.push(forum)

    const response = await sut.execute({ forumId: forum.id.toString() })

    expect(response.isRight()).toBeTruthy()
    if(!response.isRight()) return;
    expect(response.value.forum.name).toEqual(forum.name)
    expect(inMemoryForumRepository.items).toEqual([])
  })
})