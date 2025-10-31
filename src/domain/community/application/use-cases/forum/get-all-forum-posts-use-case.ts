// import { Injectable } from "@nestjs/common";
// import { ForumRepository } from "../../repositories/forum-repository";
// import { Post } from "@/domain/community/enterprise/entities/post";
// import { Either, right } from "@/core/either";

// type GetAllForumPostsUseCaseRequest = {
//   forumId: string
// }

// type GetAllForumPostsUseCaseResponse = Either<
//   null,
//   {
//     posts: Post[]
//   }
// >

// @Injectable()
// export class GetAllForumPostsUseCase {
//   constructor (
//     private forumRepository: ForumRepository
//   ) {}

//   async execute(request: GetAllForumPostsUseCaseRequest): Promise<GetAllForumPostsUseCaseResponse> {
//     const posts = await this.forumRepository.findAllPosts(request.forumId)

//     return right({ posts })
//   }
// }