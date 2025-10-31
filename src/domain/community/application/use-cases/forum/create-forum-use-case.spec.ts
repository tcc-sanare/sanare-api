import { InMemoryForumRepository } from "test/repositories/in-memory-forum-repository";
import { CreateForumUseCase } from "./create-forum-use-case"
import { Forum } from "@/domain/community/enterprise/entities/forum";
import { makeForum } from "test/factories/make-forum";

describe('CreateForumUseCase', () => {
  let sut: CreateForumUseCase;
  let inMemoryForumRepository: InMemoryForumRepository

  beforeEach(() => {
    inMemoryForumRepository = new InMemoryForumRepository;
    sut = new CreateForumUseCase(inMemoryForumRepository)
  })

  it('should be created a forum', async () => {
    const forum = makeForum()
    const response = await sut.execute({
      body: forum.body,
      link: forum.link
    })
    
    expect(response.isRight()).toBe(true)
    if(!response.isRight()) return;
    expect(response.value.forum.body).toEqual(forum.body)
    expect(response.value.forum.link).toEqual(forum.link)
    expect(response.value.forum.id).toEqual(inMemoryForumRepository.items[0].id)
  })
})